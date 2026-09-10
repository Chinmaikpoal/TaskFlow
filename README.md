# TaskFlow — Frontend Task Management Application

> **Phase 1 Internship Submission**: Modern, responsive, and accessible client-side task management frontend built with React, Vite, and LocalStorage.

---

## 📋 Project Overview

**TaskFlow** is a client-side Single Page Application (SPA) designed to empower individuals and teams to track, organize, and prioritize their tasks. Developed during Phase 1 (Weeks 1 to 4) of the internship, TaskFlow emphasizes clean component architecture, reliable state management, responsive UI/UX across devices, and instant LocalStorage persistence without backend requirements.

---

## 🌟 Key Features (Phase 1 Deliverables)

### 1. Requirements Analysis & Visual Wireframing (Week 1)
- Comprehensive UI planning and architecture documented in `WIREFRAME_PLAN.md`.
- Interactive multi-view wireframe prototype in `wireframe.html` featuring Dashboard, Task List, Add/Edit modals, Empty States, and a 375px mobile viewport frame.

### 2. React Component Architecture (Week 2)
- Reusable component breakdown separating concerns across `Header`, `Dashboard`, `StatsCard`, `TaskList`, `TaskCard`, `TaskForm`, `SearchBar`, `FilterBar`, and `EmptyState`.
- Modern, clean CSS design system (`styles.css`) using CSS variables, custom typography, elevation shadows, and accessible color contrast.
- Fully responsive layout adapting smoothly between **Desktop** (1024px+), **Tablet** (640px–1024px), and **Mobile** (<640px).

### 3. Full Task CRUD Functionality (Week 3)
- **Add Task**: Modal form with Title, Description, Priority (High, Medium, Low), and Due Date.
- **Validation**: Strict validation requiring Title and Due Date with user-friendly error messages and prevention of invalid submissions.
- **Edit Task**: Reusable modal pre-populates existing values, updates the task in-place, and refreshes the UI immediately.
- **Delete Task**: Built-in modal confirmation dialog to prevent accidental task deletion.
- **Complete & Restore**: Instant completion toggle with strikethrough styling and one-click restoration back to "Pending".

### 4. Reactive State Management & Local Storage (Week 4)
- **Dashboard Counters**: 4 live metric cards for *Total Tasks*, *Pending Tasks*, *Completed Tasks*, and *High Priority Tasks* that compute reactively on every state modification.
- **Search & Filters**: Real-time text search across title and description combined seamlessly with status (`All`, `Pending`, `Completed`) and priority (`High`, `Medium`, `Low`) filters.
- **Context-Aware Empty States**: Specific feedback screens for:
  1. *No Tasks in App*
  2. *No Matching Search/Filter Results*
  3. *No Completed Tasks Yet*
- **Persistence**: Automatic synchronization with browser `LocalStorage`, preserving all task edits, creations, and deletions across page refreshes and browser restarts.
- **User Feedback**: Non-blocking toast notifications for task creation, edits, deletions, and status toggles.

---

## 🛠️ Technologies Used

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 / React Hooks (`useState`, `useEffect`, `useMemo`, `useRef`) | Component-driven UI and reactive state handling |
| **Build Tool** | Vite 6 | Fast HMR and optimized production bundling |
| **Persistence**| HTML5 LocalStorage API | Reliable browser-level persistence without a server |
| **Styling** | Modern CSS (CSS Variables, Flexbox, CSS Grid, Media Queries) | Clean, professional, responsive design system |
| **Typography** | Inter (Google Fonts) | High legibility on all display sizes |

---

## 📁 Folder Structure

```
Phase1/
├── public/
│   └── favicon.svg              # SVG checkmark favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx           # App branding, status pill & "+ Add Task" button
│   │   ├── Dashboard.jsx        # Dashboard overview container
│   │   ├── StatsCard.jsx        # Metric stat card with icons and counts
│   │   ├── SearchBar.jsx        # Search input with clear action
│   │   ├── FilterBar.jsx        # Segmented filter buttons for status & priority
│   │   ├── TaskList.jsx         # Responsive grid container for task cards
│   │   ├── TaskCard.jsx         # Individual task card with badge & actions
│   │   ├── TaskForm.jsx         # Reusable modal form for Add and Edit with validation
│   │   └── EmptyState.jsx       # Context-aware empty state graphics & messaging
│   ├── App.jsx                  # Main application container, state & persistence
│   ├── main.jsx                 # Application entry point
│   └── styles.css               # Design system, CSS variables & responsive rules
├── index.html                   # HTML5 template
├── package.json                 # Scripts and project dependencies
├── vite.config.js               # Vite bundler configuration
├── README.md                    # Project documentation
├── WIREFRAME_PLAN.md            # Week 1 UI planning, workflows & responsive design
├── wireframe.html               # Week 1 interactive visual wireframe prototype
└── .gitignore                   # Ignored files (node_modules, dist, logs)
```

---

## 🚀 How to Install & Run

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended, e.g. Node 22)
- **npm** (v9.0.0 or higher)

### Installation Steps

1. Open your terminal in the project directory:
   ```bash
   cd Phase1
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

To test or generate the production build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 📝 Phase 1 Requirements Completion Summary

| Week | Deliverable / Requirement | Status |
| :--- | :--- | :--- |
| **Week 1** | Requirement Analysis & Feature Checklist | ✅ Completed (`WIREFRAME_PLAN.md`) |
| **Week 1** | Screen & Wireframe Descriptions | ✅ Completed (`WIREFRAME_PLAN.md`) |
| **Week 1** | Standalone Visual Wireframe Suite | ✅ Completed (`wireframe.html`) |
| **Week 1** | Responsive Breakpoints Plan | ✅ Completed (`WIREFRAME_PLAN.md`) |
| **Week 2** | React + Vite Setup | ✅ Completed (`package.json`, `vite.config.js`) |
| **Week 2** | Reusable Component Architecture | ✅ Completed (`src/components/*`) |
| **Week 2** | Clean Internship-Grade CSS Design System | ✅ Completed (`src/styles.css`) |
| **Week 2** | Responsive Layout (Desktop, Tablet, Mobile) | ✅ Completed |
| **Week 3** | Add Task with Title & Due Date Validation | ✅ Completed (`TaskForm.jsx`) |
| **Week 3** | Edit Task with Pre-populated Values | ✅ Completed (`TaskForm.jsx`) |
| **Week 3** | Delete Task with Confirmation Dialog | ✅ Completed (`App.jsx` modal) |
| **Week 3** | Complete & Restore Task Action | ✅ Completed (`TaskCard.jsx`) |
| **Week 4** | React Hooks State Management | ✅ Completed (`useState`, `useEffect`, `useMemo`) |
| **Week 4** | LocalStorage Persistence & Auto-Sync | ✅ Completed |
| **Week 4** | Contextual Empty States (3 Types) | ✅ Completed (`EmptyState.jsx`) |
| **Week 4** | Dashboard Statistics Calculation (4 Metrics) | ✅ Completed (`Dashboard.jsx`) |
| **Week 4** | Combined Search & Multi-Filter Engine | ✅ Completed (`SearchBar.jsx`, `FilterBar.jsx`) |
