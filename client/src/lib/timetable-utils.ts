import type { ClassItem, Day, TimeConflict, TimeSlot } from "@shared/schema";
import { CLASS_COLORS, DAYS } from "@shared/schema";

// Convert time string to minutes since midnight
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convert minutes to time string
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Format time for display (12-hour format)
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// Check if two time ranges overlap
export function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

// Find all conflicts in a list of classes
export function findConflicts(classes: ClassItem[]): TimeConflict[] {
  const conflicts: TimeConflict[] = [];

  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const class1 = classes[i];
      const class2 = classes[j];

      // Check each day for overlap
      for (const day of class1.days) {
        if (class2.days.includes(day)) {
          if (timesOverlap(class1.startTime, class1.endTime, class2.startTime, class2.endTime)) {
            conflicts.push({ class1, class2, day });
          }
        }
      }
    }
  }

  return conflicts;
}

// Generate time slots for the grid (6 AM to 10 PM, 1-hour intervals)
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    slots.push({
      hour,
      minute: 0,
      label: `${displayHour}:00 ${period}`,
    });
  }
  return slots;
}

// Get a color for a class based on its index
export function getClassColor(index: number): string {
  return CLASS_COLORS[index % CLASS_COLORS.length];
}

// Generate unique ID
export function generateId(): string {
  return `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate class position and height in the grid
export function getClassGridPosition(
  classItem: ClassItem,
  slotHeight: number = 60
): { top: number; height: number } {
  const startMinutes = timeToMinutes(classItem.startTime);
  const endMinutes = timeToMinutes(classItem.endTime);
  const gridStartMinutes = 6 * 60; // 6 AM

  const top = ((startMinutes - gridStartMinutes) / 60) * slotHeight;
  const height = ((endMinutes - startMinutes) / 60) * slotHeight;

  return { top, height };
}

// Get classes for a specific day
export function getClassesForDay(classes: ClassItem[], day: Day): ClassItem[] {
  return classes.filter((c) => c.days.includes(day));
}

// Sort classes by start time
export function sortByTime(classes: ClassItem[]): ClassItem[] {
  return [...classes].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
}

// Check if a time slot is available across all specified days
function isSlotAvailable(
  start: number,
  end: number,
  days: readonly Day[],
  occupiedSlots: Map<Day, Array<{ start: number; end: number; classId: string }>>,
  excludeClassId?: string
): boolean {
  for (const day of days) {
    const daySlots = occupiedSlots.get(day)!;
    for (const slot of daySlots) {
      if (excludeClassId && slot.classId === excludeClassId) continue;
      if (start < slot.end && end > slot.start) {
        return false;
      }
    }
  }
  return true;
}

// Mark slots as occupied for all specified days
function markSlotsOccupied(
  start: number,
  end: number,
  days: readonly Day[],
  classId: string,
  occupiedSlots: Map<Day, Array<{ start: number; end: number; classId: string }>>
): void {
  for (const day of days) {
    occupiedSlots.get(day)!.push({ start, end, classId });
  }
}

// Auto-arrange classes to avoid conflicts
// This algorithm uses a greedy approach:
// 1. Sort all classes by their duration (longer classes first) to prioritize harder-to-place items
// 2. For each class, try to schedule it at its original time
// 3. If there's a conflict, try shifting the class to the next available time slot
// 4. Keep all classes that fit, flag those that couldn't be scheduled
// 5. Verify the final schedule has no conflicts before returning
export function autoArrangeClasses(
  classes: ClassItem[]
): { arranged: ClassItem[]; conflicts: ClassItem[] } {
  if (classes.length === 0) return { arranged: [], conflicts: [] };

  // Sort by duration (longer first), then by start time to prioritize harder-to-place classes
  const sorted = [...classes].sort((a, b) => {
    const durationA = timeToMinutes(a.endTime) - timeToMinutes(a.startTime);
    const durationB = timeToMinutes(b.endTime) - timeToMinutes(b.startTime);
    if (durationA !== durationB) return durationB - durationA; // Longer first
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime); // Earlier first
  });

  const arranged: ClassItem[] = [];
  const unschedulable: ClassItem[] = [];

  // Track occupied time slots per day - each entry is independent
  const occupiedSlots: Map<Day, Array<{ start: number; end: number; classId: string }>> = new Map();
  DAYS.forEach((day) => occupiedSlots.set(day, []));

  const gridStart = 6 * 60; // 6 AM
  const gridEnd = 22 * 60; // 10 PM

  for (const classItem of sorted) {
    const classStart = timeToMinutes(classItem.startTime);
    const classEnd = timeToMinutes(classItem.endTime);
    const duration = classEnd - classStart;

    // First, try the original time slot
    if (isSlotAvailable(classStart, classEnd, classItem.days, occupiedSlots)) {
      // Create a deep copy to avoid any mutation issues
      const scheduledClass: ClassItem = {
        ...classItem,
        days: [...classItem.days],
      };
      arranged.push(scheduledClass);
      markSlotsOccupied(classStart, classEnd, classItem.days, classItem.id, occupiedSlots);
      continue;
    }

    // Try to find an alternative time slot
    let foundSlot = false;
    
    // Try different start times in 30-minute increments
    for (let newStart = gridStart; newStart + duration <= gridEnd; newStart += 30) {
      const newEnd = newStart + duration;

      if (isSlotAvailable(newStart, newEnd, classItem.days, occupiedSlots)) {
        // Found a slot - create a new class with updated times
        const rescheduledClass: ClassItem = {
          ...classItem,
          days: [...classItem.days],
          startTime: minutesToTime(newStart),
          endTime: minutesToTime(newEnd),
        };
        arranged.push(rescheduledClass);
        markSlotsOccupied(newStart, newEnd, classItem.days, classItem.id, occupiedSlots);
        foundSlot = true;
        break;
      }
    }

    if (!foundSlot) {
      unschedulable.push(classItem);
    }
  }

  // Final verification: ensure no conflicts in the arranged schedule
  const finalConflicts = findConflicts(arranged);
  if (finalConflicts.length > 0) {
    // This shouldn't happen, but if it does, return the original classes
    // so the user sees their schedule unchanged with the conflicts shown
    console.error("Auto-arrange produced conflicts, returning original schedule");
    return { arranged: classes, conflicts: [] };
  }

  return { arranged, conflicts: unschedulable };
}

// Local storage key
const STORAGE_KEY = "timetable_data";

// Save timetable to localStorage
export function saveTimetable(classes: ClassItem[]): void {
  const data = {
    classes,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Load timetable from localStorage
export function loadTimetable(): { classes: ClassItem[]; lastUpdated: string | null } {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { classes: [], lastUpdated: null };

  try {
    const data = JSON.parse(stored);
    return {
      classes: data.classes || [],
      lastUpdated: data.lastUpdated || null,
    };
  } catch {
    return { classes: [], lastUpdated: null };
  }
}

// Format relative time
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString();
}
