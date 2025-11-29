import { AlertTriangle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { TimeConflict } from "@shared/schema";
import { formatTime } from "@/lib/timetable-utils";

interface ConflictAlertProps {
  conflicts: TimeConflict[];
  onDismiss?: () => void;
}

export function ConflictAlert({ conflicts, onDismiss }: ConflictAlertProps) {
  if (conflicts.length === 0) return null;

  // Group conflicts by unique pairs
  const uniqueConflicts = conflicts.reduce((acc, conflict) => {
    const key = [conflict.class1.id, conflict.class2.id].sort().join("-");
    if (!acc.has(key)) {
      acc.set(key, conflict);
    }
    return acc;
  }, new Map<string, TimeConflict>());

  return (
    <Alert variant="destructive" className="relative">
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onDismiss}
          data-testid="button-dismiss-conflict"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">
        Schedule Conflicts Detected ({uniqueConflicts.size})
      </AlertTitle>
      <AlertDescription className="mt-2">
        <ul className="space-y-1 text-sm">
          {Array.from(uniqueConflicts.values()).map((conflict, index) => (
            <li key={index} className="flex flex-wrap items-center gap-1">
              <span className="font-medium">{conflict.class1.name}</span>
              <span className="text-destructive-foreground/70">
                ({formatTime(conflict.class1.startTime)}-{formatTime(conflict.class1.endTime)})
              </span>
              <span>overlaps with</span>
              <span className="font-medium">{conflict.class2.name}</span>
              <span className="text-destructive-foreground/70">
                ({formatTime(conflict.class2.startTime)}-{formatTime(conflict.class2.endTime)})
              </span>
              <span>on {conflict.day}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
