# Time Table Generator

A beautiful, responsive web application for creating and managing weekly schedules. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Add Classes**: Create class entries with subject name, day(s) of week, start/end times, and optional location
- **Weekly Grid View**: Visual representation of your schedule from Monday to Sunday with time slots from 6 AM to 10 PM
- **Auto-Arrange**: Automatically optimize your schedule to avoid time conflicts using a greedy scheduling algorithm
- **Conflict Detection**: Visual alerts when classes overlap on the same day and time
- **Save/Load**: Automatic persistence to localStorage - your schedule is saved automatically
- **PDF Export**: Export your timetable as a professional PDF document (grid view or class list)
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## How Auto-Arrange Works

The auto-arrange feature uses a **greedy scheduling algorithm** to optimize your timetable:

1. **Sort by Duration**: Classes are sorted by duration (longest first) to prioritize harder-to-place items, then by start time
2. **Track Occupied Slots**: The algorithm maintains a map of occupied time slots for each day independently
3. **Schedule or Reschedule**: For each class:
   - First, try to schedule at the original requested time
   - If there's a conflict, search for the next available time slot (in 30-minute increments) within the school day (6 AM - 10 PM)
   - Multi-day classes are handled atomically - all days must have availability for the same time slot
4. **Verification**: After arranging, the algorithm verifies no conflicts exist in the final schedule
5. **Handle Unschedulable Classes**: Classes that can't fit anywhere are flagged and the user is notified

This approach ensures that:
- Longer classes (harder to place) get priority scheduling
- Multi-day classes maintain consistent timing across all their days
- The algorithm tries to preserve your original time preferences when possible
- All successfully scheduled classes are guaranteed conflict-free

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React hooks + localStorage
- **PDF Generation**: jsPDF with jspdf-autotable
- **Icons**: Lucide React
- **Routing**: Wouter

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── add-class-form.tsx
│   │   │   ├── weekly-grid.tsx
│   │   │   ├── mobile-schedule.tsx
│   │   │   └── ...
│   │   ├── lib/            # Utilities and helpers
│   │   │   ├── timetable-utils.ts
│   │   │   ├── pdf-export.ts
│   │   │   └── theme-provider.tsx
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application
│   └── index.html
├── server/                 # Express server
├── shared/
│   └── schema.ts          # TypeScript types and Zod schemas
└── README.md
```

## Deployment

### Deploy on Replit

1. Fork or import this project to Replit
2. Click the "Deploy" button
3. Your app will be live at your Replit URL

### Deploy Elsewhere

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

## Usage

1. **Add a Class**: Fill out the form with subject name, select the days, set start/end times, and optionally add a location
2. **View Schedule**: See your classes displayed in the weekly grid (desktop) or accordion view (mobile)
3. **Auto-Arrange**: Click "Auto-Arrange" to automatically resolve any time conflicts
4. **Export**: Use the Export dropdown to download your schedule as a PDF
5. **Dark Mode**: Toggle the theme using the sun/moon icon in the header

## License

MIT License - feel free to use this project for personal or commercial purposes.
