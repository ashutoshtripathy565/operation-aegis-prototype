# 🎨 OPERATION AEGIS — Redesign & Customization Guide

This guide is for developers, UI/UX designers, and team members who want to customize, restyle, or rebuild **OPERATION AEGIS**.

---

## ⚡ 1. Fast Track: How to See Changes Instantly

1. Start the development server using the Desktop shortcut: **`Start OPERATION AEGIS`** (or open a terminal in this folder and run `npm run dev`).
2. The site opens at **`http://localhost:5173`**.
3. **Any change you save in the `src/` folder updates immediately in your browser** (Hot Module Replacement / Instant Live Reload).

---

## 📂 2. Codebase Map (Where Everything Lives)

```
OPERATION-AEGIS/
├── index.html                 <-- Browser title, favicon, and root HTML shell
├── package.json               <-- Project dependencies (React 18, Vite, Lucide Icons)
├── SETUP.bat                  <-- One-click automated setup for fresh Windows PCs
├── start-server.bat           <-- Starts dev server & opens browser
├── stop-server.bat            <-- Shuts down server cleanly
├── src/
│   ├── index.css              <-- 🎨 MASTER STYLESHEET & DESIGN TOKENS (Colors, fonts, cards)
│   ├── main.jsx               <-- React root entry point
│   ├── App.jsx                <-- Navigation router & role-based screen switcher
│   ├── context/
│   │   └── AegisContext.jsx   <-- 📊 Data store & mock military database (soldiers, scores)
│   ├── components/
│   │   └── AppShell.jsx       <-- Top navigation bar, user profile badge, sign-out button
│   └── pages/
│       ├── Home.jsx           <-- 🏠 Landing page & mission brief
│       ├── Login.jsx          <-- 🔐 Authentication screen with sandbox demo bypass
│       ├── SoldierDashboard.jsx   <-- 🪖 Individual soldier readiness & vitals
│       ├── CommanderDashboard.jsx <-- 🎖️ Section/Battalion tactical command view
│       ├── MedicalDashboard.jsx   <-- 🩺 Medical triage & physical/cognitive health
│       └── AdminDashboard.jsx     <-- ⚙️ System audit logs, RBAC & diagnostics
└── dist/                      <-- Production build (created by `npm run build`)
```

---

## 🎨 3. Theme & Color Customization (`src/index.css`)

All colors, surfaces, borders, and typography are controlled by **CSS Custom Properties (Variables)** at the top of [`src/index.css`](file:///src/index.css). Changing these values changes the appearance across the entire application.

### Key Variables in `:root`:

| Variable | Current Value | Description |
| :--- | :--- | :--- |
| `--bg-primary` | `#f1f5f9` | Main page background |
| `--bg-secondary` | `#ffffff` | Card, dialog, and panel background |
| `--bg-tertiary` | `#e2e8f0` | Subtle background highlights |
| `--border-color` | `#cbd5e1` | Card outlines and separators |
| `--text-primary` | `#0f172a` | Main heading and body text |
| `--text-secondary` | `#475569` | Subtitles, labels, and secondary text |
| `--text-muted` | `#64748b` | Timestamps, hints, and muted captions |
| `--accent-cyan` | `#4a5d2e` | Primary theme accent (Military Olive) |
| `--status-ready` | `#16a34a` | Green indicator: Mission Ready |
| `--status-teal` | `#0284c7` | Blue indicator: Normal / Stable |
| `--status-monitor` | `#d97706` | Orange indicator: Monitor Required |
| `--status-recovery`| `#ea580c` | Red-Orange indicator: High Fatigue |
| `--status-critical`| `#dc2626` | Red indicator: Critical Attention |

---

### 🌟 Example Theme Presets

To switch themes, open [`src/index.css`](file:///src/index.css) and replace lines 1–34 with one of these presets:

#### Preset A: Tactical Dark / Cyber Theme
```css
:root {
  --bg-primary: #0a0f18;
  --bg-secondary: #111a28;
  --bg-tertiary: #19273c;
  --border-color: #1e3a5f;
  --border-glow: rgba(0, 240, 255, 0.15);
  
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  --accent-cyan: #00f0ff;
  --accent-cyan-glow: rgba(0, 240, 255, 0.25);
  
  --status-ready: #22c55e;
  --status-teal: #06b6d4;
  --status-monitor: #f59e0b;
  --status-recovery: #f97316;
  --status-critical: #ef4444;
  
  --glass-bg: rgba(17, 26, 40, 0.85);
  --glass-border: #1e3a5f;
  color-scheme: dark;
}
```

#### Preset B: Modern Navy Defense Theme
```css
:root {
  --bg-primary: #0b132b;
  --bg-secondary: #1c2541;
  --bg-tertiary: #3a506b;
  --border-color: #486581;
  --border-glow: rgba(91, 192, 190, 0.15);
  
  --text-primary: #ffffff;
  --text-secondary: #cbd5e1;
  --text-muted: #829ab1;
  
  --accent-cyan: #5bc0be;
  --accent-cyan-glow: rgba(91, 192, 190, 0.2);
  
  --status-ready: #10b981;
  --status-teal: #38bdf8;
  --status-monitor: #fbbf24;
  --status-recovery: #fb923c;
  --status-critical: #f43f5e;
  color-scheme: dark;
}
```

---

## 🏷️ 4. Changing App Title, Logos & Branding

1. **Browser Tab Title & Favicon**:
   - File: [`index.html`](file:///index.html)
   - Change `<title>OPERATION AEGIS — Decision Support System</title>` on line 7.
   - Change the SVG `<link rel="icon" ...>` on line 5.

2. **Top Navigation Bar & Header**:
   - File: [`src/components/AppShell.jsx`](file:///src/components/AppShell.jsx)
   - Change the logo text `AEGIS`, title, or user badges.

3. **Landing Page Hero & Copy**:
   - File: [`src/pages/Home.jsx`](file:///src/pages/Home.jsx)
   - Update mission title, headlines, feature cards, and footer links.

---

## 📊 5. Customizing Data & Personnel (`src/context/AegisContext.jsx`)

All soldiers, vital statistics, duty rosters, and roles are defined in [`src/context/AegisContext.jsx`](file:///src/context/AegisContext.jsx) inside the `initialSoldiers` array.

You can modify or add new personnel:
```javascript
{
  id: "IC-57556H",
  serviceNumber: "IC-57556H",
  role: "commander",           // 'commander', 'soldier', 'medical', or 'admin'
  name: "Vikram Batra",
  rank: "Captain",
  unit: "13 JAK RIF",
  age: 34,
  bloodGroup: "B+",
  medicalCategory: "SHAPE-1",
  cri: 88,                     // Composite Readiness Index (0-100)
  dci: 96,                     // Dynamic Cognitive Index (0-100)
  mrs: 94,                     // Mission Readiness Score (0-100)
  domainScores: {
    physical: 44,              // max 50
    cognitive: 22,             // max 25
    operational: 18,           // max 20
    environmental: 4           // max 5
  }
}
```

---

## 🚀 6. Exporting Your Redesign for Production

Once you are satisfied with your redesign, build a clean static distribution by running:
```powershell
npm run build
```
This compiles your React code into the `dist/` directory. The contents of `dist/` are pure HTML, JavaScript, and CSS that can be uploaded to **Netlify**, **Vercel**, **GitHub Pages**, **AWS S3**, or any local web server.
