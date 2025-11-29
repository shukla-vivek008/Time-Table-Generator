# Time Table Generator - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Material Design  
**Justification:** This is a utility-focused productivity application requiring clear information hierarchy, efficient data input/display, and consistent UI patterns. Material Design provides excellent components for forms, grids, and data visualization.

**Key Principles:**
- Clarity and readability for schedule information
- Efficient workflow for adding/editing classes
- Clear visual separation between interface sections
- Responsive grid that adapts to mobile/tablet/desktop

---

## Typography

**Font Family:** Inter or Roboto via Google Fonts CDN

**Hierarchy:**
- Page Title: text-3xl, font-semibold (Time Table Generator)
- Section Headers: text-xl, font-semibold (Add Class, Weekly Schedule)
- Grid Headers (Days): text-base, font-medium, uppercase tracking-wide
- Time Slot Labels: text-sm, font-medium
- Class/Subject Names: text-sm, font-semibold
- Form Labels: text-sm, font-medium
- Body Text/Location: text-sm, regular
- Buttons: text-sm, font-medium

---

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, and 8  
(p-2, p-4, p-6, p-8, gap-4, space-y-6, etc.)

**Container Structure:**
- Main container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Section spacing: space-y-8 for major sections
- Form fields: space-y-4
- Grid cells: p-2 or p-3 for time slots

**Responsive Breakpoints:**
- Mobile (default): Single column layout, vertical schedule scrolling
- Tablet (md:768px): Two-column form, horizontal schedule scroll
- Desktop (lg:1024px): Full width grid with all days visible

---

## Component Library

### Header/Navigation
- Fixed or sticky header with app title on left
- Action buttons on right: "Add Class", "Auto-Generate", "Export PDF"
- Include save status indicator ("Last saved: X minutes ago")
- Height: h-16, bottom border for separation

### Add Class Form
- Card-based container with rounded corners and subtle elevation
- Form layout: Grid with 2 columns on desktop (grid-cols-1 md:grid-cols-2)
- Input fields: Full-width with labels above, standard height (h-10 or h-12)
- Day selector: Checkbox group with visual multi-select (flex flex-wrap gap-2)
- Time inputs: Side-by-side start/end time with clear labels
- Submit button: Primary action, full-width on mobile, auto-width on desktop
- Form spacing: p-6, gap-4 between fields

### Weekly Schedule Grid
**Desktop Layout:**
- 8-column grid: First column for time labels, 7 columns for days (Mon-Sun)
- Time column: Sticky left position, width w-20
- Day columns: Equal width, min-width to prevent crushing
- Grid structure: border-collapse style with cell borders

**Time Slots:**
- Height: h-16 per 30-minute block (or h-20 for hourly blocks)
- Grid cells contain class cards when scheduled
- Empty cells show subtle grid lines for reference

**Class Cards (within grid cells):**
- Rounded corners (rounded-md)
- Padding: p-2
- Display: Subject name (font-semibold), time range (text-xs), location (text-xs)
- Delete/edit icons in top-right corner (show on hover on desktop, always visible on mobile)
- Span multiple rows if class duration exceeds one time block

**Grid Header:**
- Day names in header row: text-center, font-medium, h-12
- Sticky top position when scrolling vertically

### Conflict Indicators
- Overlapping time slots: Visual warning with border treatment
- Conflict message: Small alert banner above schedule with icon
- Highlight conflicting classes with distinct visual treatment

### Action Buttons
**Primary Actions:**
- "Add Class": Solid button with icon (plus sign)
- "Auto-Generate": Prominent secondary button
- "Export PDF": Icon button or outlined button

**Secondary Actions:**
- "Clear All": Text or outlined button with confirmation
- "Load Saved": Subtle button in header
- Individual class delete: Icon button (trash icon)

### Empty States
- No classes added: Centered message with call-to-action
- Empty time slots: Subtle hint text "Click to add class" on hover

### Mobile Adaptations
- Schedule: Vertical day-by-day layout (accordion or tabs for each day)
- Form: Single column, full-width inputs
- Time slots: Larger touch targets (h-20 minimum)
- Floating action button for "Add Class" on mobile

---

## Interaction Patterns

**Form Submission:**
- Add class immediately updates grid view
- Clear visual feedback (success message or animation)

**Auto-Generate:**
- Loading state with spinner during processing
- Toast/snackbar notification on completion

**Drag and Drop (Future Enhancement):**
- Placeholder for dragging classes between time slots
- Visual drop zones with hover states

**PDF Export:**
- Generate modal/loading overlay while processing
- Automatic download on completion

---

## Data Display

**Schedule Information Hierarchy:**
1. Day and time (most prominent)
2. Subject/Class name (primary focus in cell)
3. Location (secondary, smaller text)
4. Duration indicator (visual cell height)

**Form Field Order:**
1. Subject/Class Name
2. Day Selection
3. Start Time / End Time (side by side)
4. Location (optional field)

---

## Icons

**Icon Library:** Heroicons via CDN (outline style for most, solid for active states)

**Required Icons:**
- Plus (add class)
- Calendar (day selection)
- Clock (time fields)
- Download (PDF export)
- Trash (delete class)
- Refresh/Arrows (auto-generate)
- Save/Cloud (save status)
- Alert/Warning (conflicts)