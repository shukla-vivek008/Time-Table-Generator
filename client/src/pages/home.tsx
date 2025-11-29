import { useState, useEffect, useCallback, useRef } from "react";
import {
  Download,
  RefreshCw,
  Save,
  Trash2,
  Clock,
  FileText,
  List,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { AddClassForm } from "@/components/add-class-form";
import { WeeklyGrid } from "@/components/weekly-grid";
import { MobileSchedule } from "@/components/mobile-schedule";
import { ClassList } from "@/components/class-list";
import { ConflictAlert } from "@/components/conflict-alert";
import { EmptyState } from "@/components/empty-state";
import { exportToPDF, exportClassListPDF } from "@/lib/pdf-export";
import {
  loadTimetable,
  saveTimetable,
  findConflicts,
  autoArrangeClasses,
  generateId,
  getClassColor,
  formatRelativeTime,
} from "@/lib/timetable-utils";
import type { ClassItem, InsertClassItem, TimeConflict } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [conflicts, setConflicts] = useState<TimeConflict[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isAutoArranging, setIsAutoArranging] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Load timetable from localStorage on mount
  useEffect(() => {
    const { classes: savedClasses, lastUpdated } = loadTimetable();
    if (savedClasses.length > 0) {
      setClasses(savedClasses);
      setLastSaved(lastUpdated);
      toast({
        title: "Timetable loaded",
        description: `${savedClasses.length} class${savedClasses.length !== 1 ? "es" : ""} restored from your last session.`,
      });
    }
  }, []);

  // Update conflicts whenever classes change
  useEffect(() => {
    setConflicts(findConflicts(classes));
  }, [classes]);

  // Auto-save to localStorage whenever classes change
  useEffect(() => {
    if (classes.length > 0) {
      saveTimetable(classes);
      setLastSaved(new Date().toISOString());
    }
  }, [classes]);

  const handleAddClass = useCallback((classData: InsertClassItem) => {
    const newClass: ClassItem = {
      ...classData,
      id: generateId(),
      color: getClassColor(classes.length),
    };
    setClasses((prev) => [...prev, newClass]);
    toast({
      title: "Class added",
      description: `"${classData.name}" has been added to your schedule.`,
    });
  }, [classes.length, toast]);

  const handleDeleteClass = useCallback((id: string) => {
    setClasses((prev) => {
      const classToDelete = prev.find((c) => c.id === id);
      if (classToDelete) {
        toast({
          title: "Class removed",
          description: `"${classToDelete.name}" has been removed from your schedule.`,
        });
      }
      return prev.filter((c) => c.id !== id);
    });
  }, [toast]);

  const handleClearAll = useCallback(() => {
    setClasses([]);
    saveTimetable([]);
    setLastSaved(null);
    setShowClearDialog(false);
    toast({
      title: "Schedule cleared",
      description: "All classes have been removed from your timetable.",
    });
  }, [toast]);

  const handleAutoArrange = useCallback(() => {
    if (classes.length === 0) {
      toast({
        title: "No classes to arrange",
        description: "Add some classes first before auto-arranging.",
        variant: "destructive",
      });
      return;
    }

    setIsAutoArranging(true);

    // Simulate a brief delay for UX
    setTimeout(() => {
      const { arranged, conflicts: unschedulable } = autoArrangeClasses(classes);

      // Reassign colors to arranged classes
      const coloredArranged = arranged.map((c, i) => ({
        ...c,
        color: getClassColor(i),
      }));

      setClasses(coloredArranged);
      setIsAutoArranging(false);

      if (unschedulable.length > 0) {
        toast({
          title: "Some classes couldn't be scheduled",
          description: `${unschedulable.length} class${unschedulable.length !== 1 ? "es" : ""} couldn't fit without conflicts and ${unschedulable.length !== 1 ? "were" : "was"} removed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Schedule optimized",
          description: "All classes have been arranged without conflicts!",
        });
      }
    }, 500);
  }, [classes, toast]);

  const handleExportPDF = useCallback(() => {
    if (classes.length === 0) {
      toast({
        title: "No classes to export",
        description: "Add some classes first before exporting.",
        variant: "destructive",
      });
      return;
    }
    exportToPDF(classes);
    toast({
      title: "PDF exported",
      description: "Your timetable has been downloaded as a PDF.",
    });
  }, [classes, toast]);

  const handleExportClassList = useCallback(() => {
    if (classes.length === 0) {
      toast({
        title: "No classes to export",
        description: "Add some classes first before exporting.",
        variant: "destructive",
      });
      return;
    }
    exportClassListPDF(classes);
    toast({
      title: "Class list exported",
      description: "Your class list has been downloaded as a PDF.",
    });
  }, [classes, toast]);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold tracking-tight">Time Table Generator</h1>
                {lastSaved && (
                  <p className="text-xs text-muted-foreground">
                    Saved {formatRelativeTime(lastSaved)}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                {classes.length} class{classes.length !== 1 ? "es" : ""}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoArrange}
                disabled={isAutoArranging || classes.length === 0}
                className="hidden sm:flex"
                data-testid="button-auto-arrange"
              >
                {isAutoArranging ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Auto-Arrange
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={classes.length === 0}
                    data-testid="button-export-menu"
                  >
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportPDF} data-testid="menu-export-grid">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Grid as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportClassList} data-testid="menu-export-list">
                    <List className="h-4 w-4 mr-2" />
                    Export Class List as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {classes.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowClearDialog(true)}
                  className="text-muted-foreground hover:text-destructive"
                  data-testid="button-clear-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Conflict alert */}
        {conflicts.length > 0 && (
          <ConflictAlert conflicts={conflicts} />
        )}

        {/* Mobile auto-arrange button */}
        <div className="sm:hidden">
          <Button
            variant="outline"
            onClick={handleAutoArrange}
            disabled={isAutoArranging || classes.length === 0}
            className="w-full"
            data-testid="button-auto-arrange-mobile"
          >
            {isAutoArranging ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Auto-Arrange Schedule
          </Button>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Form and Class List */}
          <div className="lg:col-span-1 space-y-6" ref={formRef}>
            <AddClassForm onAddClass={handleAddClass} />
            <ClassList
              classes={classes}
              conflicts={conflicts}
              onDeleteClass={handleDeleteClass}
            />
          </div>

          {/* Right column: Schedule Grid */}
          <div className="lg:col-span-2">
            {classes.length === 0 ? (
              <EmptyState onAddClass={scrollToForm} />
            ) : (
              <>
                {/* Desktop grid */}
                <div className="hidden lg:block">
                  <WeeklyGrid
                    classes={classes}
                    conflicts={conflicts}
                    onDeleteClass={handleDeleteClass}
                  />
                </div>

                {/* Mobile accordion */}
                <MobileSchedule
                  classes={classes}
                  conflicts={conflicts}
                  onDeleteClass={handleDeleteClass}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Clear confirmation dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Classes?</DialogTitle>
            <DialogDescription>
              This will remove all {classes.length} class{classes.length !== 1 ? "es" : ""} from
              your schedule. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowClearDialog(false)}
              data-testid="button-cancel-clear"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              data-testid="button-confirm-clear"
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
