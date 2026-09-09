# OPERATION AEGIS — AI Architecture Context

This document is designed for AI agents to quickly understand the architecture, data models, logic, and customization patterns of **OPERATION AEGIS**.

## 1. Project Overview & Tech Stack
- **Purpose**: A tactical military readiness and decision support single-page application (SPA).
- **Framework**: React 18
- **Build Tool**: Vite (`npm run dev`, `npm run build`)
- **State Management**: React Context API (`src/context/AegisContext.jsx`). No Redux/Zustand.
- **Routing**: Pure conditional rendering via React state (`App.jsx`). No `react-router-dom`.
- **Styling**: Vanilla CSS with heavy reliance on CSS Variables for theming (`src/index.css`).
- **Icons**: `lucide-react`
- **External Integration**: Google Fitness API via Google Identity Services (`src/services/healthConnectService.js`).

## 2. Directory Structure
```text
/
├── SETUP.bat / start-server.bat   # Windows automation scripts for user setup
├── package.json                   # Defines dependencies (react, react-dom, lucide-react)
├── vite.config.js                 # Vite bundler configuration
├── index.html                     # HTML entry point (contains inline SVG favicon)
└── src/
    ├── main.jsx                   # React DOM render entry
    ├── App.jsx                    # Root component handling routing (conditional rendering)
    ├── index.css                  # Global styles and CSS variables
    ├── context/
    │   └── AegisContext.jsx       # The core database and logic engine
    ├── components/
    │   └── AppShell.jsx           # Global layout wrapper (Sidebar, Header, HUD simulation)
    ├── services/
    │   └── healthConnectService.js# Google Fitness OAuth & API fetching
    └── pages/
        ├── Home.jsx               # Landing page
        ├── Login.jsx              # Role-based login gateway
        ├── CommanderDashboard.jsx # Tactical view, aggregates unit data
        ├── SoldierDashboard.jsx   # Individual soldier view, biometric syncing
        ├── MedicalDashboard.jsx   # Clinical overview, thresholds, biometric complaints
        └── AdminDashboard.jsx     # System configuration, OAuth ID setup
```

## 3. State Management & Logic (`AegisContext.jsx`)
This file is the "backend" of the application.

### The `soldiers` Array (Mock DB)
Each soldier object has the following critical shape:
```json
{
  "id": "JC-472118K",
  "serviceNumber": "JC-472118K",
  "role": "soldier",
  "name": "Rajesh Kumar",
  "rank": "Havildar",
  "cri": 91,           // Combat Readiness Index (0-100)
  "dci": 94,           // Daily Cognitive Index
  "domainScores": {    // Sub-scores summing to CRI
    "physical": 46,    // Max 50
    "cognitive": 23,   // Max 25
    "operational": 18, // Max 20
    "environmental": 4 // Max 5
  },
  "alerts": [],
  "operationalStatus": "Available",
  "availability": true,
  "deviceConnected": true,
  "deviceBattery": 85
}
```

### Readiness Engine (`calculateCRI` & `getReadinessBand`)
The Combat Readiness Index (CRI) is the absolute sum of the 4 `domainScores`.
Bands:
- **≥ 90**: Mission Ready (Green / `--status-ready`)
- **≥ 75**: Ready (Blue / `--status-teal`)
- **≥ 60**: Monitor (Yellow / `--status-monitor`)
- **≥ 40**: Recovery Required (Orange / `--status-recovery`)
- **< 40**: Critical (Red / `--status-critical`)

### Biometrics Engine
Defined in `BIOMETRIC_THRESHOLDS`. Limits for `restingHR`, `spO2`, `hrv`, and `sleepHours`.
The `checkBiometricThresholds(data)` function takes a payload from Google Fitness and returns an array of violations (Warnings/Criticals) if thresholds are breached.

### Authentication (`login`)
Login relies on `serviceNumber`. There is a hardcoded bypass (`if (user === 'COMMANDER')`, etc.) which sets `userRole`. Valid roles are `'guest'`, `'commander'`, `'soldier'`, `'medical'`, and `'admin'`.

## 4. UI Layout & Navigation
Routing happens in `src/App.jsx` via `activeView` (home, login, dashboard).
If `dashboard`, it renders `<AppShell>` which wraps one of the Role Dashboards.
`<AppShell>` is responsible for the left sidebar, the top nav (with simulated UTC clock), notifications bell, and logout logic.

## 5. Third-Party Service Integrations
### Google Fitness (`healthConnectService.js`)
- Dynamically loads Google Identity Services script.
- Prompts OAuth pop-up for `fitness.heart_rate.read`, `fitness.activity.read`, `fitness.sleep.read`.
- Fetches data spanning the last 7 days.
- **Mock Fallback**: If real data fails or doesn't exist, it uses `getSyntheticData` to gracefully return static simulated data so the demo doesn't crash.

## 6. CSS & Theming (`index.css`)
- **Glassmorphism**: UI uses semi-transparent backgrounds with borders (`.glass-panel`).
- **Typography**: Heavily relies on system sans-serif and `Share Tech Mono` for a tactical/HUD feel.
- **CSS Variables**: All colors are defined in `:root`. Example: `--bg-primary`, `--accent-cyan`.
- **Glow Effects**: Used extensively for status indicators (`box-shadow: 0 0 10px var(--status-ready-glow)`).

## 7. How to Modify This System
- **Adding a new soldier**: Append an object to `initialSoldiers` in `AegisContext.jsx`. Ensure the `id` and `serviceNumber` are unique.
- **Changing the scoring logic**: Modify `calculateCRI` and the max values in `AegisContext.jsx`. You will also need to update the UI bars in `SoldierDashboard.jsx` and `CommanderDashboard.jsx` if max values change.
- **Adding a new Page/Role**: 
  1. Add the role to the login bypass in `AegisContext.jsx`.
  2. Create a new `NewRoleDashboard.jsx`.
  3. Add conditional rendering in `App.jsx` inside the `<AppShell>` block (`{userRole === 'newrole' && <NewRoleDashboard />}`).
- **Modifying Biometric Thresholds**: Edit the `BIOMETRIC_THRESHOLDS` constant in `AegisContext.jsx`. The Medical Dashboard will automatically reflect these changes.
