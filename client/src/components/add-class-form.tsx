import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, MapPin, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertClassItemSchema, DAYS, type InsertClassItem, type Day } from "@shared/schema";

interface AddClassFormProps {
  onAddClass: (classItem: InsertClassItem) => void;
}

export function AddClassForm({ onAddClass }: AddClassFormProps) {
  const form = useForm<InsertClassItem>({
    resolver: zodResolver(insertClassItemSchema),
    defaultValues: {
      name: "",
      days: [],
      startTime: "09:00",
      endTime: "10:00",
      location: "",
    },
  });

  const onSubmit = (data: InsertClassItem) => {
    onAddClass(data);
    form.reset({
      name: "",
      days: [],
      startTime: "09:00",
      endTime: "10:00",
      location: "",
    });
  };

  return (
    <Card className="border-card-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          Add New Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Subject / Class Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g., Mathematics, Physics Lab"
                        className="pl-10"
                        data-testid="input-class-name"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Days of Week</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DAYS.map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="days"
                        render={({ field }) => (
                          <FormItem key={day}>
                            <FormControl>
                              <label
                                className={`
                                  inline-flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer
                                  transition-all duration-150
                                  ${
                                    field.value?.includes(day)
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background border-border hover-elevate"
                                  }
                                `}
                                data-testid={`checkbox-day-${day.toLowerCase()}`}
                              >
                                <Checkbox
                                  className="sr-only"
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    const current = field.value || [];
                                    if (checked) {
                                      field.onChange([...current, day]);
                                    } else {
                                      field.onChange(current.filter((d) => d !== day));
                                    }
                                  }}
                                />
                                <span className="text-sm font-medium">{day.slice(0, 3)}</span>
                              </label>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Start Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          data-testid="input-start-time"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">End Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          data-testid="input-end-time"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Location{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g., Room 101, Building A"
                        className="pl-10"
                        data-testid="input-location"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full sm:w-auto" data-testid="button-add-class">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
