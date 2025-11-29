import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ClassCard } from "./class-card";
import type { ClassItem, Day, TimeConflict } from "@shared/schema";
import { DAYS } from "@shared/schema";
import {
  generateTimeSlots,
  getClassesForDay,
  getClassGridPosition,
  timeToMinutes,
} from "@/lib/timetable-utils";

interface WeeklyGridProps {
  classes: ClassItem[];
  conflicts: TimeConflict[];
  onDeleteClass: (id: string) => void;
}

const SLOT_HEIGHT = 60; // pixels per hour

export function WeeklyGrid({ classes, conflicts, onDeleteClass }: WeeklyGridProps) {
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Create a set of class IDs that have conflicts
  const conflictingClassIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts.forEach((c) => {
      ids.add(c.class1.id);
      ids.add(c.class2.id);
    });
    return ids;
  }, [conflicts]);

  // Calculate grid height based on time slots
  const gridHeight = timeSlots.length * SLOT_HEIGHT;

  return (
    <Card className="border-card-border overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Calendar className="h-5 w-5 text-primary" />
          Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            {/* Header row with days */}
            <div className="flex border-b border-border sticky top-0 bg-card z-10">
              <div className="w-20 shrink-0 p-3 border-r border-border">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Time
                </span>
              </div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex-1 p-3 text-center border-r border-border last:border-r-0 min-w-[100px]"
                >
                  <span className="text-sm font-medium uppercase tracking-wide">{day}</span>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {getClassesForDay(classes, day).length} class
                    {getClassesForDay(classes, day).length !== 1 ? "es" : ""}
                  </div>
                </div>
              ))}
            </div>

            {/* Grid body */}
            <div className="flex">
              {/* Time column */}
              <div className="w-20 shrink-0 border-r border-border">
                {timeSlots.map((slot, index) => (
                  <div
                    key={slot.label}
                    className="h-[60px] px-2 flex items-start justify-end pt-1 border-b border-border"
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  >
                    <span className="text-xs font-medium text-muted-foreground">{slot.label}</span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAYS.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  classes={getClassesForDay(classes, day)}
                  conflictingIds={conflictingClassIds}
                  onDeleteClass={onDeleteClass}
                  slotHeight={SLOT_HEIGHT}
                  gridHeight={gridHeight}
                  timeSlots={timeSlots}
                />
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface DayColumnProps {
  day: Day;
  classes: ClassItem[];
  conflictingIds: Set<string>;
  onDeleteClass: (id: string) => void;
  slotHeight: number;
  gridHeight: number;
  timeSlots: { hour: number; minute: number; label: string }[];
}

function DayColumn({
  day,
  classes,
  conflictingIds,
  onDeleteClass,
  slotHeight,
  gridHeight,
  timeSlots,
}: DayColumnProps) {
  return (
    <div
      className="flex-1 relative border-r border-border last:border-r-0 min-w-[100px]"
      data-testid={`day-column-${day.toLowerCase()}`}
    >
      {/* Hour grid lines */}
      {timeSlots.map((slot, index) => (
        <div
          key={slot.label}
          className="absolute w-full border-b border-border"
          style={{
            top: `${index * slotHeight}px`,
            height: `${slotHeight}px`,
          }}
        />
      ))}

      {/* Class cards */}
      <div className="relative" style={{ height: `${gridHeight}px` }}>
        {classes.map((classItem) => {
          const { top, height } = getClassGridPosition(classItem, slotHeight);
          const isCompact = height < 50;

          return (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onDelete={onDeleteClass}
              style={{ top: `${top}px`, height: `${height}px` }}
              isCompact={isCompact}
              hasConflict={conflictingIds.has(classItem.id)}
            />
          );
        })}

        {/* Empty state for this day */}
        {classes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No classes</span>
          </div>
        )}
      </div>
    </div>
  );
}
