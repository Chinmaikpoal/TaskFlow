# Final Demo Walkthrough — TaskFlow Application

This script provides an interactive step-by-step demonstration walkthrough for evaluating the completed Phase 2 application.

---

## Demo Script & Feature Verification Steps

### Step 1: Productivity Dashboard
- **Action**: Open TaskFlow in your web browser.
- **Observation**:
  - The dashboard displays 4 summary cards: **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **High Priority**.
  - Notice the **Completion Rate** badge (e.g. `40% DONE`).
  - Click on the **Pending Tasks** card: Notice the status filter automatically switches to "Pending".
  - Click on the **Total Tasks** card: Returns the view back to all tasks.

---

### Step 2: Add New Task
- **Action**: Click the primary `+ Add Task` button in the header.
- **Interaction**:
  - The modal dialog opens smoothly with keyboard focus automatically placed into the **Task Title** field.
  - Leave title blank and click "Create Task": Notice inline validation triggers indicating *"Task title is required."*.
  - Fill out the form:
    - **Title**: `Configure Automated Deployment Workflow`
    - **Description**: `Setup GitHub Actions CI/CD to build and publish preview branches.`
    - **Priority**: Select `High` (button turns rose-red).
    - **Due Date**: Select a date in the coming week.
  - Click `Create Task`.
- **Result**:
  - Modal closes.
  - The new task appears at the top of the task list with an active **High** priority badge.
  - Dashboard counters (Total, Pending, High Priority) increment immediately.
  - A green toast notification announces: *"Task created successfully!"*.

---

### Step 3: Edit Task
- **Action**: Locate the newly created task card and click the `Edit` button.
- **Interaction**:
  - The modal opens pre-filled with the existing values.
  - Modify the title to: `Configure Automated Deployment Workflow (Vite & Vercel)`
  - Switch priority to `Medium`.
  - Click `Update Task`.
- **Result**:
  - Card updates in real-time with the new title and amber **Medium** priority badge.
  - High Priority counter decrements by 1; Medium count increments.
  - Toast notification appears: *"Task updated successfully!"*.

---

### Step 4: Complete Task
- **Action**: Click the checkbox on any pending task card, or click its `Complete` action button.
- **Result**:
  - The checkbox fills with an emerald checkmark.
  - The task title displays readable strikethrough styling and muted text color.
  - A green `Done` badge appears in the header.
  - The card action button shifts to `Restore`.
  - The "Completed Tasks" counter increments and "Pending Tasks" decrements.
  - Toast notification fires: *"Task completed! Great job! 🎉"*.

---

### Step 5: Restore Task to Pending
- **Action**: On the completed task card, click the `Restore` action button or unchecked box.
- **Result**:
  - The strikethrough is removed and card contrast is restored to full opacity.
  - The "Done" badge disappears.
  - Counters adjust back to pending state.
  - Toast notification displays: *"Task restored to Pending."*.

---

### Step 6: Live Search by Title and Description
- **Action**: In the search bar, type `Requirement`.
- **Observation**:
  - The list updates in real-time on each keystroke without needing to press Enter.
  - Only tasks containing "Requirement" in their title or description remain visible.
  - The task counter badge updates to show: `1 task (of 5 total)`.
  - Click the `(x)` clear button in the search bar: full list is restored immediately.

---

### Step 7: Filter by Status and Priority
- **Action**:
  - Click the `Pending` status pill: Only unfinished tasks remain.
  - Click the `High` priority pill: Now only tasks that are **both** Pending AND High Priority are displayed!
  - Notice the combined filtering derivation operates seamlessly without data loss.

---

### Step 8: Multi-Criteria Sorting
- **Action**: Open the `Sort:` dropdown selector in the filter toolbar:
  - Choose `Due Date (Earliest)`: Tasks reorder with the closest upcoming deadlines at the top.
  - Choose `Priority (High → Low)`: Tasks reorder with High priority items first, followed by Medium, then Low.
  - Choose `Oldest First`: Tasks sort chronologically by original creation timestamp.
  - Choose `Newest First`: Tasks restore to newest first.

---

### Step 9: Delete Task with Confirmation Guard
- **Action**: Click the `Delete` button on a task card.
- **Interaction**:
  - A red danger modal dialog opens, showing an alert icon, warning copy, and a preview of the task title.
  - Press `Cancel` or `Esc`: Modal closes without deleting.
  - Click `Delete` again and click `Yes, Delete Task`.
- **Result**:
  - The task is permanently removed from the application.
  - Dashboard counters update.
  - A red toast notification confirms deletion.

---

### Step 10: Local Storage Persistence
- **Action**:
  - Refresh the browser (`F5` or `Ctrl+R`).
  - Alternatively, close the browser tab and reopen it.
- **Result**:
  - All custom tasks, completion statuses, and updated statistics hydrate immediately from `localStorage`.
  - Zero data loss occurs.

---

### Step 11: Cross-Device Responsiveness
- **Action**: Open Browser Developer Tools (`F12`) and toggle Device Emulation (e.g. iPhone 14 / 390px width):
- **Observation**:
  - Header reorganizes into a compact mobile layout with icon and "+ button".
  - Dashboard metrics adapt into a balanced 2x2 grid.
  - Filter pills support smooth horizontal touch-scrolling.
  - Task cards adapt to 100% width single-column layout.
  - Modals adapt into bottom-sheet dialogs for comfortable thumb interaction.
