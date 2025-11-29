# Time Table Generator

## Overview

A responsive web application for creating and managing weekly class schedules with automatic conflict detection and PDF export capabilities. Built as a client-side productivity tool with React, TypeScript, and Tailwind CSS, utilizing localStorage for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript in strict mode, using Vite as the build tool and development server.

**Routing:** Wouter for lightweight client-side routing with a simple two-route structure (Home and NotFound pages).

**State Management:** React hooks (`useState`, `useEffect`, `useCallback`) for local component state. No global state management library - all schedule data is managed at the Home page level and passed down as props.

**Data Persistence:** localStorage-based storage for timetable data. The application automatically saves changes and loads the schedule on mount. No backend database integration currently implemented, though the infrastructure includes Drizzle ORM configuration for potential PostgreSQL integration.

**Form Handling:** React Hook Form with Zod validation for type-safe form inputs, particularly for the add class form.

**UI Component System:** Shadcn/ui components (Radix UI primitives) styled with Tailwind CSS following the "new-york" style variant. Custom Material Design-inspired design system with Inter font family.

**Styling Approach:** Tailwind CSS with custom CSS variables for theming. Supports light and dark mode toggling with localStorage persistence. Design system uses specific spacing units (2, 4, 6, 8) and responsive breakpoints (mobile-first, md: 768px, lg: 1024px).

**Scheduling Algorithm:** Client-side greedy scheduling algorithm for auto-arrange functionality. Sorts classes by start time, tracks occupied time slots per day, and attempts to reschedule conflicting classes in 30-minute increments within a 6 AM - 10 PM window.

### Backend Architecture

**Server Framework:** Express.js with TypeScript, configured for development with tsx and production builds with esbuild.

**Current Implementation:** Minimal backend setup with placeholder routes and in-memory storage interface. The `MemStorage` class provides a template for future database integration.

**Session Management:** Infrastructure includes express-session with support for both in-memory (memorystore) and PostgreSQL session stores (connect-pg-simple).

**Build Process:** Custom build script that bundles allowlisted dependencies to reduce syscalls and improve cold start times. Separates client (Vite) and server (esbuild) build processes.

**Development Server:** Vite middleware mode integrated with Express for hot module replacement during development.

### Data Schema

**Class/Subject Model:** Validated with Zod schemas including:
- `id` (auto-generated string)
- `name` (required subject name)
- `days` (array of weekdays: Monday-Sunday)
- `startTime` and `endTime` (HH:mm format strings)
- `location` (optional)
- `color` (auto-generated for visual differentiation)

**Conflict Detection:** Client-side time overlap calculation that checks all class pairs for same-day time conflicts. Returns array of `TimeConflict` objects identifying both classes and the conflicting day.

**Time Utilities:** Custom functions for time conversion (string to minutes, minutes to string, 12/24 hour formatting) and time slot generation for the weekly grid display.

### Key Features Implementation

**Weekly Grid View:** Responsive calendar grid with:
- 60px per hour slot height
- Absolute positioning for class cards based on time calculations
- Horizontal scrolling for mobile, full width display for desktop
- Visual conflict indicators with red ring styling

**Mobile Optimization:** Accordion-based day view for mobile devices (< 768px), with full grid view for larger screens. Default opens to current day.

**PDF Export:** Client-side PDF generation using jsPDF and jspdf-autotable. Two export modes: grid view and class list view.

**Theme System:** Context-based theme provider with localStorage persistence. Toggles between light and dark mode with CSS variable updates on document root.

**Toast Notifications:** Custom toast system (not @tanstack/react-query) for user feedback on actions like add, delete, auto-arrange results.

## External Dependencies

**UI Framework:**
- React 18 (react, react-dom)
- Radix UI primitives (@radix-ui/react-*) for accessible component foundations
- Tailwind CSS for utility-first styling with PostCSS and Autoprefixer

**Form & Validation:**
- React Hook Form (@hookform/resolvers)
- Zod for runtime type validation
- drizzle-zod for database schema validation

**Database (Configured, Not Active):**
- Drizzle ORM (drizzle-orm, drizzle-kit) with PostgreSQL dialect
- @neondatabase/serverless for Neon PostgreSQL connections
- connect-pg-simple for PostgreSQL session storage

**Server:**
- Express.js with TypeScript
- express-session for session management
- memorystore as fallback session store
- cors for cross-origin requests (if needed)

**Build & Development:**
- Vite with React plugin and HMR
- esbuild for server bundling
- tsx for TypeScript execution
- @replit/vite-plugin-* for Replit-specific features (runtime errors, cartographer, dev banner)

**PDF Generation:**
- jsPDF for PDF creation
- jspdf-autotable for table formatting in PDFs

**Date/Time:**
- date-fns for date manipulation and formatting

**Utilities:**
- nanoid for unique ID generation
- clsx and tailwind-merge (via cn utility) for conditional class names
- class-variance-authority (cva) for component variant management
- cmdk for command palette components

**Type Checking:**
- TypeScript with strict mode
- Node and Vite type definitions