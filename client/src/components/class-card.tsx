import { Trash2, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClassItem } from "@shared/schema";
import { formatTime } from "@/lib/timetable-utils";

interface ClassCardProps {
  classItem: ClassItem;
  onDelete: (id: string) => void;
  style?: React.CSSProperties;
  isCompact?: boolean;
  hasConflict?: boolean;
}

export function ClassCard({
  classItem,
  onDelete,
  style,
  isCompact = false,
  hasConflict = false,
}: ClassCardProps) {
  const bgColor = classItem.color || "hsl(217, 91%, 60%)";

  return (
    <div
      className={`
        absolute left-1 right-1 rounded-md overflow-hidden
        transition-all duration-150 group
        ${hasConflict ? "ring-2 ring-destructive ring-offset-1" : ""}
      `}
      style={{
        ...style,
        backgroundColor: bgColor,
        minHeight: isCompact ? "28px" : "48px",
      }}
      data-testid={`class-card-${classItem.id}`}
    >
      <div className="h-full p-2 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between gap-1">
          <span
            className={`font-semibold leading-tight line-clamp-2 ${isCompact ? "text-xs" : "text-sm"}`}
          >
            {classItem.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-white/80 hover:text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(classItem.id);
            }}
            data-testid={`button-delete-class-${classItem.id}`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        {!isCompact && (
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-1 text-white/90">
              <Clock className="h-3 w-3" />
              <span className="text-xs">
                {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
              </span>
            </div>
            {classItem.location && (
              <div className="flex items-center gap-1 text-white/80">
                <MapPin className="h-3 w-3" />
                <span className="text-xs truncate">{classItem.location}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
