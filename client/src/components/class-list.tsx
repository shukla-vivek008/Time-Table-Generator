import { Trash2, MapPin, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ClassItem, TimeConflict } from "@shared/schema";
import { formatTime, sortByTime } from "@/lib/timetable-utils";
import { useMemo } from "react";

interface ClassListProps {
  classes: ClassItem[];
  conflicts: TimeConflict[];
  onDeleteClass: (id: string) => void;
}

export function ClassList({ classes, conflicts, onDeleteClass }: ClassListProps) {
  const sortedClasses = useMemo(() => sortByTime(classes), [classes]);

  // Create a set of class IDs that have conflicts
  const conflictingClassIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => {
      ids.add(c.class1.id);
      ids.add(c.class2.id);
    });
    return ids;
  }, [conflicts]);

  if (classes.length === 0) {
    return null;
  }

  return (
    <Card className="border-card-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-lg font-semibold">
          <span>All Classes ({classes.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-2">
            {sortedClasses.map((classItem) => (
              <div
                key={classItem.id}
                className={`
                  flex items-center justify-between gap-3 p-3 rounded-md bg-muted/50
                  ${conflictingClassIds.has(classItem.id) ? "ring-1 ring-destructive" : ""}
                `}
                data-testid={`class-list-item-${classItem.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: classItem.color || "hsl(217, 91%, 60%)" }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{classItem.name}</span>
                      {conflictingClassIds.has(classItem.id) && (
                        <Badge variant="destructive" className="text-xs">
                          Conflict
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {classItem.days.map((d) => d.slice(0, 3)).join(", ")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                      </span>
                      {classItem.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {classItem.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeleteClass(classItem.id)}
                  data-testid={`button-delete-list-${classItem.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
