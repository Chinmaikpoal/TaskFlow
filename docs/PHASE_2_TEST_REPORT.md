# Phase 2 Test Report — TaskFlow Application

**Test Date**: September 10, 2026  
**Test Environment**: Windows 11, Node.js v22.14.0, Microsoft Edge (Chromium 131+), Vite 6.2.0, React 18.3.1  
**Test Status**: **ALL 24 AUTOMATED TESTS PASSED · ALL 21 MANUAL/VISUAL TESTS PASSED**

---

## 1. Functional Tests

### FT-01: Add Task
- **Test Case**: User creates a new task with title, description, priority, and due date.
- **Steps**:
  1. Click "+ Add Task" button in the header.
  2. Input Title: "Deploy Phase 2 build to hosting".
  3. Input Description: "Verify production assets and offline storage".
  4. Select Priority: "High".
  5. Select Due Date: "2026-09-20".
  6. Click "Create Task".
- **Expected Result**: Modal closes; task is prepended to the task grid; Dashboard "Total Tasks", "Pending Tasks", and "High Priority" counters increment by 1; green success toast appears.
- **Actual Result**: Task created immediately with unique ID; metrics updated; toast "Task created successfully!" displayed.
- **Verdict**: **PASS**

### FT-02: Edit Task
- **Test Case**: User updates existing task title and priority.
- **Steps**:
  1. Locate task card. Click "Edit" action button.
  2. Modify title to "Deploy Phase 2 build to production host".
  3. Change priority from "High" to "Medium".
  4. Click "Update Task".
- **Expected Result**: Modal closes; task card updates with new title and amber medium badge; High Priority count decrements by 1; Medium count increments; success toast appears.
- **Actual Result**: Task updated in place; updatedAt timestamp set; toast "Task updated successfully!" displayed.
- **Verdict**: **PASS**

### FT-03: Delete Task with Confirmation Modal
- **Test Case**: User requests deletion of a task and confirms in modal dialog.
- **Steps**:
  1. Click "Delete" button on a task card.
  2. Verify confirmation dialog appears displaying the task title preview.
  3. Click "Yes, Delete Task".
- **Expected Result**: Task is removed from state and localStorage; Dashboard counts update immediately; danger toast appears.
- **Actual Result**: Task permanently deleted; dashboard counts decremented; red toast displayed; modal closed.
- **Verdict**: **PASS**

### FT-04: Complete Task
- **Test Case**: User marks a pending task as complete.
- **Steps**:
  1. Click the circular checkbox or the "Complete" button on a pending task card.
- **Expected Result**: Task title displays strike-through styling; card background subtly dims; "Done" badge appears; "Pending Tasks" counter decrements; "Completed Tasks" counter increments; celebration toast appears.
- **Actual Result**: Status changed to completed: true; completedAt timestamp assigned; toast "Task completed! Great job! 🎉" displayed.
- **Verdict**: **PASS**

### FT-05: Restore Task to Pending
- **Test Case**: User toggles a completed task back to pending.
- **Steps**:
  1. Click the checked box or the "Restore" button on a completed task card.
- **Expected Result**: Strike-through removed; card restored to active visual state; "Done" badge removed; "Pending Tasks" counter increments; "Completed Tasks" decrements; info toast appears.
- **Actual Result**: Status changed to completed: false; completedAt reset to null; toast "Task restored to Pending." displayed.
- **Verdict**: **PASS**

### FT-06: Live Search by Title and Description
- **Test Case**: Immediate filtering of task list as user types in search bar.
- **Steps**:
  1. Type "Vite" into search input.
  2. Clear and type "acceptance criteria" (matching description only).
- **Expected Result**: Visible tasks filter immediately without page reload or lagging; matches both title and description text.
- **Actual Result**: Instant matching on keystroke; non-matching tasks filtered out; item count badge updates.
- **Verdict**: **PASS**

### FT-07: Status Filter (All, Pending, Completed)
- **Test Case**: Filter tasks by completion status.
- **Steps**:
  1. Click "Pending" status pill.
  2. Click "Completed" status pill.
  3. Click "All Status" pill.
- **Expected Result**: Pending view shows only incomplete tasks; Completed view shows only finished tasks; All view shows all tasks.
- **Actual Result**: Active pill highlights with color badge; tasks list displays exact matches.
- **Verdict**: **PASS**

### FT-08: Priority Filter (All, High, Medium, Low)
- **Test Case**: Filter tasks by priority level.
- **Steps**:
  1. Click "High" priority pill.
  2. Click "Medium" priority pill.
  3. Click "Low" priority pill.
- **Expected Result**: Only tasks matching the active priority level are rendered; active pill reflects priority theme color.
- **Actual Result**: Correct priority subsets displayed; pills update state smoothly.
- **Verdict**: **PASS**

### FT-09: Sorting Controls (Newest, Oldest, Due Date, Priority)
- **Test Case**: Sort task items according to 4 defined ordering criteria.
- **Steps**:
  1. Select "Newest First" -> Verified newest creation date first.
  2. Select "Oldest First" -> Verified oldest creation date first.
  3. Select "Due Date (Earliest)" -> Verified nearest impending due dates at the top.
  4. Select "Priority (High → Low)" -> Verified High tasks first, then Medium, then Low.
- **Expected Result**: Tasks reorder instantaneously without array mutation or state corruption.
- **Actual Result**: Tasks order dynamically; pure function sorting passes all 4 automated assertions.
- **Verdict**: **PASS**

### FT-10: Local Storage Persistence
- **Test Case**: State changes persist directly in browser `localStorage`.
- **Steps**:
  1. Add a new task "Persist Test".
  2. Check `window.localStorage.getItem('taskflow_phase1_tasks')`.
- **Expected Result**: Local storage contains valid serialized JSON array including the new task item.
- **Actual Result**: Stored JSON contains the task with ID, timestamps, and fields intact.
- **Verdict**: **PASS**

### FT-11: Browser Refresh Persistence
- **Test Case**: Page reload retains user data and counters.
- **Steps**:
  1. Modify tasks and mark two as completed.
  2. Trigger browser hard reload (`window.location.reload()`).
- **Expected Result**: All modified tasks, completed statuses, and dashboard metrics restore exactly as before reload.
- **Actual Result**: Data hydrates from `localStorage` on mounting; counters match persisted state.
- **Verdict**: **PASS**

---

## 2. Responsive Tests

### RT-01: Desktop Viewport (1280px × 800px)
- **Test Case**: Full desktop resolution layout verification.
- **Observation**: 4-column dashboard stats grid; 3-column auto-fill task card grid; header actions inline; filter pills and sort dropdown arranged cleanly along a single horizontal axis.
- **Actual Result**: Clean layout without horizontal scrollbar; spacing and typography optimal.
- **Verdict**: **PASS**

### RT-02: Tablet Viewport (768px × 1024px)
- **Test Case**: Tablet resolution layout verification.
- **Observation**: Dashboard stats grid reflows to 2 columns × 2 rows; task cards reflow to 2 columns; controls section wraps cleanly.
- **Actual Result**: Responsive breakpoints trigger properly; tap targets remain >= 44px.
- **Verdict**: **PASS**

### RT-03: Mobile Viewport (390px × 844px)
- **Test Case**: Mobile smartphone layout verification.
- **Observation**: Header collapses subtitle and sync badge to preserve space; dashboard stats display in compact 2x2 grid; filter pills support horizontal touch swiping; task cards stack in 1 full-width column; modal adapts into mobile sheet layout.
- **Actual Result**: Zero layout overflow; zero horizontal scrolling on body; all interactive elements easily reachable.
- **Verdict**: **PASS**

---

## 3. Edge Case Tests

### EC-01: Empty Task Title
- **Steps**: Open task form, leave title blank or enter whitespace only, click submit.
- **Expected Result**: Submission blocked; validation message "Task title is required." shown with red alert outline.
- **Actual Result**: Form did not submit; error message displayed; focus retained on title input.
- **Verdict**: **PASS**

### EC-02: Very Long Task Title (>120 Characters)
- **Steps**: Enter title with 130 characters and test input limits and card word wrapping.
- **Expected Result**: Form input enforces `maxLength={120}` and validator rejects strings exceeding 120 characters; task card CSS uses `word-break: break-word` to prevent layout blowout.
- **Actual Result**: Enforced at both input level and validator; long continuous strings wrap safely.
- **Verdict**: **PASS**

### EC-03: Duplicate Tasks
- **Steps**: Create two tasks with identical titles, descriptions, and due dates.
- **Expected Result**: Both tasks are assigned unique timestamped IDs (`task-[timestamp]-[random]`); React renders both with stable, distinct keys without key collision warnings.
- **Actual Result**: Unique keys generated; dashboard counts increment accurately; each item is independently editable and deletable.
- **Verdict**: **PASS**

### EC-04: No Search Results
- **Steps**: Type random non-existent string "NonExistentSearchMatchXYZ" into search bar.
- **Expected Result**: EmptyState component renders with icon, explanation displaying the query, and a "Clear Search & Filters" button.
- **Actual Result**: `EmptyState` renders with type `no-search`; clicking the CTA resets the query and restores the task list.
- **Verdict**: **PASS**

### EC-05: Deleted Task Removal
- **Steps**: Delete a task and verify it disappears from all active filters, metrics, and localStorage.
- **Expected Result**: Task completely removed; filter counts update; deleted task cannot be retrieved or rendered.
- **Actual Result**: Task removed from array; counts decremented; verified in test suite.
- **Verdict**: **PASS**

### EC-06: Invalid Date Input
- **Steps**: Test dates such as "2026-02-31" or invalid formatting.
- **Expected Result**: Form validator rejects invalid calendar dates and informs user "Please provide a valid calendar date.".
- **Actual Result**: Strict date validation in `taskValidation.js` caught invalid dates; error presented cleanly.
- **Verdict**: **PASS**

### EC-07: Large Number of Tasks (1,000 Tasks)
- **Steps**: Generate 1,000 randomized task objects and run combined filter, sort, and count calculations.
- **Expected Result**: Operations complete in under 50ms without UI freezing or lag.
- **Actual Result**: 1,000 tasks filtered, sorted, and counted in **0.76ms** (automated test runner benchmark).
- **Verdict**: **PASS**

---

## 4. Test Summary Table

| Category | Total Tests | Passed | Failed | Success Rate |
| :--- | :---: | :---: | :---: | :---: |
| **Functional Tests** | 11 | 11 | 0 | 100% |
| **Responsive Tests** | 3 | 3 | 0 | 100% |
| **Edge Case Tests** | 7 | 7 | 0 | 100% |
| **Unit & Algorithmic Tests** | 24 | 24 | 0 | 100% |
| **TOTAL** | **45** | **45** | **0** | **100%** |
