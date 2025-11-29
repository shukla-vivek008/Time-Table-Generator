import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onAddClass?: () => void;
}

export function EmptyState({ onAddClass }: EmptyStateProps) {
  return (
    <Card className="border-card-border border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CalendarDays className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          Start building your weekly schedule by adding your first class. You can add subjects,
          set times, and organize your entire week.
        </p>
        {onAddClass && (
          <Button onClick={onAddClass} data-testid="button-add-first-class">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Class
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
