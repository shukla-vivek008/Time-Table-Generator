import { z } from "zod";

// Days of the week
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type Day = (typeof DAYS)[number];

// Class/Subject schema
export const classItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Subject name is required"),
  days: z.array(z.enum(DAYS)).min(1, "At least one day is required"),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  location: z.string().optional(),
  color: z.string().optional(),
});

export type ClassItem = z.infer<typeof classItemSchema>;

// Insert schema (without auto-generated id and color)
export const insertClassItemSchema = classItemSchema.omit({ id: true, color: true });
export type InsertClassItem = z.infer<typeof insertClassItemSchema>;

// Timetable schema
export const timetableSchema = z.object({
  classes: z.array(classItemSchema),
  lastUpdated: z.string().optional(),
});

export type Timetable = z.infer<typeof timetableSchema>;

// Conflict type for overlapping classes
export interface TimeConflict {
  class1: ClassItem;
  class2: ClassItem;
  day: Day;
}

// Time slot for grid display
export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

// Class colors for visual distinction
export const CLASS_COLORS = [
  "hsl(217, 91%, 60%)",   // Blue (primary)
  "hsl(142, 76%, 36%)",   // Green
  "hsl(280, 65%, 55%)",   // Purple
  "hsl(43, 96%, 56%)",    // Yellow/Orange
  "hsl(340, 82%, 52%)",   // Pink/Red
  "hsl(190, 90%, 40%)",   // Cyan
  "hsl(25, 95%, 53%)",    // Orange
  "hsl(260, 60%, 50%)",   // Indigo
] as const;
