import assert from 'node:assert';
import { validateTask } from '../src/utils/taskValidation.js';
import { filterTasks, calculateFilterCounts } from '../src/utils/taskFilters.js';
import { sortTasks } from '../src/utils/taskSorting.js';

console.log('====================================================');
console.log('TASKFLOW PHASE 2 — AUTOMATED TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function runTest(testName, fn) {
  try {
    fn();
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${testName}`);
    console.error(`         Error: ${err.message}`);
    failedTests++;
  }
}

// -----------------------------------------------------------------------------
// 1. FUNCTIONAL TESTS — TASK VALIDATION
// -----------------------------------------------------------------------------
console.log('--- 1. FUNCTIONAL TESTS: TASK VALIDATION ---');

runTest('Valid task payload passes validation', () => {
  const result = validateTask({
    title: 'Complete Phase 2 Testing',
    dueDate: '2026-09-25',
    priority: 'High',
    description: 'Verify all functional and edge-case requirements.',
  });
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(Object.keys(result.errors).length, 0);
});

runTest('Edge Case 1: Empty task title is rejected', () => {
  const result = validateTask({
    title: '   ',
    dueDate: '2026-09-25',
  });
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.title, 'Task title is required.');
});

runTest('Short task title (< 2 chars) is rejected', () => {
  const result = validateTask({
    title: 'A',
    dueDate: '2026-09-25',
  });
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.title, 'Task title must be at least 2 characters long.');
});

runTest('Edge Case 2: Very long task title (> 120 chars) is safely rejected', () => {
  const longTitle = 'A'.repeat(125);
  const result = validateTask({
    title: longTitle,
    dueDate: '2026-09-25',
  });
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.title, 'Task title cannot exceed 120 characters.');
});

runTest('Edge Case 6: Invalid date format is rejected', () => {
  const result = validateTask({
    title: 'Test Invalid Date',
    dueDate: '25-09-2026', // Wrong format
  });
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.dueDate, 'Due date must be in YYYY-MM-DD format.');
});

runTest('Edge Case 6: Non-existent calendar date (Feb 31) is rejected', () => {
  const result = validateTask({
    title: 'Test Non-existent Date',
    dueDate: '2026-02-31',
  });
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.dueDate, 'Please provide a valid calendar date.');
});

// -----------------------------------------------------------------------------
// 2. FUNCTIONAL TESTS — SEARCH, FILTER & COUNTS
// -----------------------------------------------------------------------------
console.log('\n--- 2. FUNCTIONAL TESTS: SEARCH, FILTER & COUNTS ---');

const sampleTasks = [
  { id: '1', title: 'Setup Vite Server', description: 'Configure development environment', priority: 'High', dueDate: '2026-09-10', completed: true, createdAt: '2026-09-01T10:00:00Z' },
  { id: '2', title: 'Write TaskForm Component', description: 'Implement inputs and validation', priority: 'High', dueDate: '2026-09-15', completed: false, createdAt: '2026-09-02T10:00:00Z' },
  { id: '3', title: 'Refactor FilterBar', description: 'Add separate status and priority pills', priority: 'Medium', dueDate: '2026-09-18', completed: false, createdAt: '2026-09-03T10:00:00Z' },
  { id: '4', title: 'Accessibility Check', description: 'Verify contrast and aria attributes', priority: 'Low', dueDate: '2026-09-20', completed: false, createdAt: '2026-09-04T10:00:00Z' },
  { id: '5', title: 'Documentation Polish', description: 'Complete README and test report', priority: 'Low', dueDate: '2026-09-25', completed: true, createdAt: '2026-09-05T10:00:00Z' },
];

runTest('Search by task title matches case-insensitively', () => {
  const filtered = filterTasks(sampleTasks, { searchQuery: 'vite' });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, '1');
});

runTest('Search by task description matches', () => {
  const filtered = filterTasks(sampleTasks, { searchQuery: 'validation' });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, '2');
});

runTest('Status filter: pending', () => {
  const filtered = filterTasks(sampleTasks, { statusFilter: 'pending' });
  assert.strictEqual(filtered.length, 3);
  assert.ok(filtered.every(t => !t.completed));
});

runTest('Status filter: completed', () => {
  const filtered = filterTasks(sampleTasks, { statusFilter: 'completed' });
  assert.strictEqual(filtered.length, 2);
  assert.ok(filtered.every(t => t.completed));
});

runTest('Priority filter: High', () => {
  const filtered = filterTasks(sampleTasks, { priorityFilter: 'high' });
  assert.strictEqual(filtered.length, 2);
  assert.ok(filtered.every(t => t.priority === 'High'));
});

runTest('Priority filter: Medium', () => {
  const filtered = filterTasks(sampleTasks, { priorityFilter: 'medium' });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].priority, 'Medium');
});

runTest('Priority filter: Low', () => {
  const filtered = filterTasks(sampleTasks, { priorityFilter: 'low' });
  assert.strictEqual(filtered.length, 2);
  assert.ok(filtered.every(t => t.priority === 'Low'));
});

runTest('Edge Case 4: No search results returns empty array', () => {
  const filtered = filterTasks(sampleTasks, { searchQuery: 'nonexistent keyword xyz123' });
  assert.strictEqual(filtered.length, 0);
});

runTest('Calculate filter counts accurately', () => {
  const counts = calculateFilterCounts(sampleTasks);
  assert.strictEqual(counts.all, 5);
  assert.strictEqual(counts.pending, 3);
  assert.strictEqual(counts.completed, 2);
  assert.strictEqual(counts.high, 2);
  assert.strictEqual(counts.medium, 1);
  assert.strictEqual(counts.low, 2);
});

// -----------------------------------------------------------------------------
// 3. FUNCTIONAL TESTS — SORTING
// -----------------------------------------------------------------------------
console.log('\n--- 3. FUNCTIONAL TESTS: SORTING ---');

runTest('Sort by Newest First (newest createdAt first)', () => {
  const sorted = sortTasks(sampleTasks, 'newest');
  assert.strictEqual(sorted[0].id, '5'); // Sept 5
  assert.strictEqual(sorted[sorted.length - 1].id, '1'); // Sept 1
});

runTest('Sort by Oldest First (oldest createdAt first)', () => {
  const sorted = sortTasks(sampleTasks, 'oldest');
  assert.strictEqual(sorted[0].id, '1'); // Sept 1
  assert.strictEqual(sorted[sorted.length - 1].id, '5'); // Sept 5
});

runTest('Sort by Due Date (earliest due date first)', () => {
  const sorted = sortTasks(sampleTasks, 'dueDate');
  assert.strictEqual(sorted[0].id, '1'); // 2026-09-10
  assert.strictEqual(sorted[sorted.length - 1].id, '5'); // 2026-09-25
});

runTest('Sort by Priority (High -> Medium -> Low)', () => {
  const sorted = sortTasks(sampleTasks, 'priority');
  assert.strictEqual(sorted[0].priority, 'High');
  assert.strictEqual(sorted[1].priority, 'High');
  assert.strictEqual(sorted[2].priority, 'Medium');
  assert.strictEqual(sorted[3].priority, 'Low');
  assert.strictEqual(sorted[4].priority, 'Low');
});

// -----------------------------------------------------------------------------
// 4. COMBINED SEARCH, FILTER & SORTING
// -----------------------------------------------------------------------------
console.log('\n--- 4. COMBINED SEARCH + FILTER + SORTING ---');

runTest('Combined: Pending + High priority + Sort by Due Date', () => {
  const filtered = filterTasks(sampleTasks, {
    statusFilter: 'pending',
    priorityFilter: 'high',
  });
  const sorted = sortTasks(filtered, 'dueDate');
  assert.strictEqual(sorted.length, 1);
  assert.strictEqual(sorted[0].id, '2');
  assert.strictEqual(sorted[0].title, 'Write TaskForm Component');
});

runTest('Combined: Search "bar" + Pending + Medium priority', () => {
  const filtered = filterTasks(sampleTasks, {
    searchQuery: 'bar',
    statusFilter: 'pending',
    priorityFilter: 'medium',
  });
  assert.strictEqual(filtered.length, 1);
  assert.strictEqual(filtered[0].id, '3');
});

// -----------------------------------------------------------------------------
// 5. EDGE CASE TESTS & PERFORMANCE
// -----------------------------------------------------------------------------
console.log('\n--- 5. EDGE CASE TESTS & PERFORMANCE ---');

runTest('Edge Case 3: Duplicate task titles do not conflict or crash', () => {
  const duplicateTasks = [
    ...sampleTasks,
    { id: 'dup-1', title: 'Accessibility Check', description: 'Second check', priority: 'High', dueDate: '2026-09-22', completed: false, createdAt: '2026-09-06T10:00:00Z' },
  ];
  const filtered = filterTasks(duplicateTasks, { searchQuery: 'Accessibility' });
  assert.strictEqual(filtered.length, 2);
  const counts = calculateFilterCounts(duplicateTasks);
  assert.strictEqual(counts.all, 6);
});

runTest('Edge Case 5: Deleted task disappears completely from lists and counts', () => {
  const remaining = sampleTasks.filter(t => t.id !== '3');
  assert.strictEqual(remaining.length, 4);
  const filtered = filterTasks(remaining, { searchQuery: 'FilterBar' });
  assert.strictEqual(filtered.length, 0);
  const counts = calculateFilterCounts(remaining);
  assert.strictEqual(counts.medium, 0); // Task 3 was the only medium task
});

runTest('Edge Case 7: Large volume of tasks (1,000 tasks) performs cleanly under 20ms', () => {
  const largeTasks = [];
  const priorities = ['Low', 'Medium', 'High'];
  for (let i = 0; i < 1000; i++) {
    largeTasks.push({
      id: `perf-${i}`,
      title: `Task number ${i} with random feature specification`,
      description: `Detailed description for item ${i} handling operations and persistence.`,
      priority: priorities[i % 3],
      dueDate: `2026-09-${String((i % 28) + 1).padStart(2, '0')}`,
      completed: i % 2 === 0,
      createdAt: new Date(1725800000000 + i * 10000).toISOString(),
    });
  }

  const startTime = performance.now();
  const filtered = filterTasks(largeTasks, {
    searchQuery: 'feature',
    statusFilter: 'pending',
    priorityFilter: 'high',
  });
  const sorted = sortTasks(filtered, 'dueDate');
  const counts = calculateFilterCounts(largeTasks);
  const duration = performance.now() - startTime;

  assert.ok(sorted.length > 0);
  assert.strictEqual(counts.all, 1000);
  assert.ok(duration < 50, `Filtering/sorting took ${duration.toFixed(2)}ms (expected < 50ms)`);
  console.log(`         -> 1,000 tasks filtered, sorted & counted in ${duration.toFixed(2)}ms`);
});

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
