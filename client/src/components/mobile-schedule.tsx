import { useMemo } from "react";
import { ChevronRight, MapPin, Clock, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ClassItem, Day, TimeConflict } from "@shared/schema";
import { DAYS } from "@shared/schema";
import { formatTime, getClassesForDay, sortByTime } from "@/lib/timetable-utils";

interface MobileScheduleProps {
  classes: ClassItem[];
  conflicts: TimeConflict[];
  onDeleteClass: (id: string) => void;
}

export function MobileSchedule({ classes, conflicts, onDeleteClass }: MobileScheduleProps) {
  // Create a set of class IDs that have conflicts
  const conflictingClassIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => {
      ids.add(c.class1.id);
      ids.add(c.class2.id);
    });
    return ids;
  }, [conflicts]);

  // Get current day for default open accordion
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }) as Day;
  const defaultDay = DAYS.includes(today) ? today : "Monday";

  return (
    <Card className="border-card-border lg:hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Accordion type="single" collapsible defaultValue={defaultDay}>
          {DAYS.map((day) => {
            const dayClasses = sortByTime(getClassesForDay(classes, day));
            const hasConflicts = dayClasses.some((c) => conflictingClassIds.has(c.id));

            return (
              <AccordionItem key={day} value={day} className="border-b last:border-b-0">
                <AccordionTrigger
                  className="px-4 py-3 hover:no-underline"
                  data-testid={`accordion-${day.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{day}</span>
                      <Badge variant={dayClasses.length > 0 ? "secondary" : "outline"}>
                        {dayClasses.length}
                      </Badge>
                    </div>
                    {hasConflicts && (
                      <Badge variant="destructive" className="mr-2">
                        Conflict
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {dayClasses.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground text-sm">
                      No classes scheduled
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayClasses.map((classItem) => (
                        <MobileClassCard
                          key={classItem.id}
                          classItem={classItem}
                          onDelete={onDeleteClass}
                          hasConflict={conflictingClassIds.has(classItem.id)}
                        />
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

interface MobileClassCardProps {
  classItem: ClassItem;
  onDelete: (id: string) => void;
  hasConflict: boolean;
}

function MobileClassCard({ classItem, onDelete, hasConflict }: MobileClassCardProps) {
  const bgColor = classItem.color || "hsl(217, 91%, 60%)";

  return (
    <div
      className={`
        rounded-md overflow-hidden
        ${hasConflict ? "ring-2 ring-destructive ring-offset-1" : ""}
      `}
      style={{ backgroundColor: bgColor }}
      data-testid={`mobile-class-card-${classItem.id}`}
    >
      <div className="p-3 text-white">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base truncate">{classItem.name}</h4>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span className="text-sm">
                  {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                </span>
              </div>
              {classItem.location && (
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-sm truncate">{classItem.location}</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-white/80 hover:text-white hover:bg-white/20"
            onClick={() => onDelete(classItem.id)}
            data-testid={`button-delete-mobile-${classItem.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
