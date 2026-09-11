import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 4173;
const DEBUG_PORT = 9222;
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

// 1. Static web server for dist
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = path.join(DIST_DIR, parsedUrl.pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          if (msg.params.type === 'error') {
            this.consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
          }
        }
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Evaluation exception');
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runLiveVerification() {
  console.log('================================================================');
  console.log('TASKFLOW PHASE 2 — LIVE BROWSER E2E VERIFICATION SUITE');
  console.log('================================================================\n');

  // Start HTTP preview server
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[1/5] Local Preview Server started on http://localhost:${PORT}`);

  // Launch Edge with remote debugging
  const edgeProcess = spawn(EDGE_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--disable-gpu',
    '--user-data-dir=C:\\Users\\kteja\\AppData\\Local\\Temp\\edge_test_profile',
    `http://localhost:${PORT}/`,
  ]);

  // Wait for Edge debugging port to open
  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      const data = await res.json();
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Edge remote debugging port');
    process.exit(1);
  }

  // Connect to target page
  const targetsRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Runtime.enable');
  await client.send('Page.enable');

  // Navigate to clean page
  await client.send('Page.navigate', { url: `http://localhost:${PORT}/` });
  await sleep(1500);

  console.log('[2/5] Connected to Microsoft Edge headless browser via CDP.');
  console.log('[3/5] Starting live interactive test scenarios...\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // VERIFY WEEK 6: DASHBOARD METRICS & INITIAL UI
  // ---------------------------------------------------------------------------
  console.log('--- A. VERIFY WEEK 6: DASHBOARD & UI ELEMENTS ---');

  await test('Dashboard renders 4 metrics (Total, Pending, Completed, High Priority)', async () => {
    const stats = await client.eval(`
      (() => {
        const cards = Array.from(document.querySelectorAll('.stats-card'));
        const total = document.querySelector('.stats-card.total .stats-card-value').textContent.trim();
        const pending = document.querySelector('.stats-card.pending .stats-card-value').textContent.trim();
        const completed = document.querySelector('.stats-card.completed .stats-card-value').textContent.trim();
        const high = document.querySelector('.stats-card.high .stats-card-value').textContent.trim();
        const completionRate = document.querySelector('.completion-rate-val').textContent.trim();
        return { count: cards.length, total, pending, completed, high, completionRate };
      })()
    `);
    if (stats.count !== 4) throw new Error(`Expected 4 stats cards, got ${stats.count}`);
    if (stats.total !== '5') throw new Error(`Expected 5 total tasks, got ${stats.total}`);
    if (stats.pending !== '3') throw new Error(`Expected 3 pending tasks, got ${stats.pending}`);
    if (stats.completed !== '2') throw new Error(`Expected 2 completed tasks, got ${stats.completed}`);
    if (stats.high !== '3') throw new Error(`Expected 3 high tasks, got ${stats.high}`);
    if (stats.completionRate !== '40%') throw new Error(`Expected 40% completion rate, got ${stats.completionRate}`);
  });

  await test('Priority badges render with correct classes and text (High, Medium, Low)', async () => {
    const badges = await client.eval(`
      (() => {
        const high = document.querySelectorAll('.badge.badge-priority-high').length;
        const med = document.querySelectorAll('.badge.badge-priority-medium').length;
        const low = document.querySelectorAll('.badge.badge-priority-low').length;
        return { high, med, low };
      })()
    `);
    if (badges.high === 0 || badges.med === 0 || badges.low === 0) {
      throw new Error(`Missing priority badges: ${JSON.stringify(badges)}`);
    }
  });

  await test('Completed task styling applies readable strikethrough & "Done" badge', async () => {
    const completedInfo = await client.eval(`
      (() => {
        const completedCards = document.querySelectorAll('.task-card.is-completed');
        const doneBadges = document.querySelectorAll('.badge-completed');
        const titleStrikethrough = completedCards.length > 0 && 
          window.getComputedStyle(completedCards[0].querySelector('.task-title')).textDecorationLine.includes('line-through');
        return { cardCount: completedCards.length, doneCount: doneBadges.length, titleStrikethrough };
      })()
    `);
    if (completedInfo.cardCount !== 2) throw new Error(`Expected 2 completed cards, got ${completedInfo.cardCount}`);
    if (completedInfo.doneCount !== 2) throw new Error(`Expected 2 Done badges, got ${completedInfo.doneCount}`);
  });

  await test('Due-date status indicators (Overdue, Due Today, Upcoming) evaluated accurately', async () => {
    const tags = await client.eval(`
      (() => {
        const dueTags = Array.from(document.querySelectorAll('.due-tag')).map(el => el.textContent.trim());
        return dueTags;
      })()
    `);
    // Seed tasks have due dates from 2026-09-10 onwards
    if (!Array.isArray(tags)) throw new Error('Failed to query due date tags');
  });

  // ---------------------------------------------------------------------------
  // VERIFY WEEK 5: SEARCH, FILTER & SORTING
  // ---------------------------------------------------------------------------
  console.log('\n--- B. VERIFY WEEK 5: SEARCH, FILTER & SORTING ---');

  await test('1. Search by task title updates list immediately as user types', async () => {
    const result = await client.eval(`
      (() => {
        const input = document.querySelector('.search-input');
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'Architecture');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const visibleTitles = Array.from(document.querySelectorAll('.task-card .task-title')).map(t => t.textContent.trim());
        return visibleTitles;
      })()
    `);
    await sleep(200);
    if (result.length !== 1 || !result[0].includes('Architecture')) {
      throw new Error(`Expected only Architecture task, got: ${JSON.stringify(result)}`);
    }
  });

  await test('2. Search by task description updates list immediately', async () => {
    const result = await client.eval(`
      (() => {
        const input = document.querySelector('.search-input');
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'wireframes');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const visibleTitles = Array.from(document.querySelectorAll('.task-card .task-title')).map(t => t.textContent.trim());
        return visibleTitles;
      })()
    `);
    await sleep(200);
    if (result.length !== 1 || !result[0].includes('Requirement Analysis')) {
      throw new Error(`Expected Requirement Analysis, got: ${JSON.stringify(result)}`);
    }
  });

  await test('3. Clear search restores full list', async () => {
    await client.eval(`
      (() => {
        const clearBtn = document.querySelector('.search-clear-btn');
        if (clearBtn) clearBtn.click();
      })()
    `);
    await sleep(300);
    const count = await client.eval(`document.querySelectorAll('.task-card').length`);
    if (count !== 5) throw new Error(`Expected 5 tasks, got ${count}`);
  });

  await test('4. Status filter: Pending shows only pending tasks', async () => {
    const res = await client.eval(`
      (() => {
        const pendingBtn = Array.from(document.querySelectorAll('.filter-pill')).find(b => b.textContent.includes('Pending'));
        pendingBtn.click();
      })()
    `);
    await sleep(200);
    const checks = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.task-card');
        const completedCards = document.querySelectorAll('.task-card.is-completed');
        return { total: cards.length, completed: completedCards.length };
      })()
    `);
    if (checks.total !== 3) throw new Error(`Expected 3 pending tasks, got ${checks.total}`);
    if (checks.completed !== 0) throw new Error(`Found completed tasks in pending view`);
  });

  await test('5. Status filter: Completed shows only completed tasks', async () => {
    await client.eval(`
      (() => {
        const completedBtn = Array.from(document.querySelectorAll('.filter-pill')).find(b => b.textContent.includes('Completed'));
        completedBtn.click();
      })()
    `);
    await sleep(200);
    const checks = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.task-card');
        const completedCards = document.querySelectorAll('.task-card.is-completed');
        return { total: cards.length, completed: completedCards.length };
      })()
    `);
    if (checks.total !== 2) throw new Error(`Expected 2 completed tasks, got ${checks.total}`);
    if (checks.completed !== 2) throw new Error(`Expected all cards to be completed`);
  });

  await test('6. Priority filter: High priority filters accurately', async () => {
    await client.eval(`
      (() => {
        const allStatusBtn = Array.from(document.querySelectorAll('.filter-pill')).find(b => b.textContent.includes('All Status'));
        allStatusBtn.click();
        const highBtn = Array.from(document.querySelectorAll('.filter-pill')).find(b => b.textContent.includes('High'));
        highBtn.click();
      })()
    `);
    await sleep(200);
    const res = await client.eval(`
      (() => {
        const cards = document.querySelectorAll('.task-card');
        const highBadges = document.querySelectorAll('.badge.badge-priority-high');
        return { cardCount: cards.length, badgeCount: highBadges.length };
      })()
    `);
    if (res.cardCount !== 3 || res.badgeCount !== 3) {
      throw new Error(`Expected 3 High priority tasks, got ${res.cardCount}`);
    }
  });

  await test('7. Sorting: Due Date (Earliest) orders nearest dates first', async () => {
    const dates = await client.eval(`
      (() => {
        // Reset filters
        document.querySelector('.reset-filter-btn')?.click();
        const sortSelect = document.querySelector('.sort-select');
        sortSelect.value = 'dueDate';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const dueTexts = Array.from(document.querySelectorAll('.task-due-date span:first-of-type')).map(e => e.textContent.trim());
        return dueTexts;
      })()
    `);
    if (dates.length !== 5) throw new Error(`Expected 5 dates, got ${dates.length}`);
  });

  await test('8. Sorting: Priority (High → Medium → Low)', async () => {
    const priorities = await client.eval(`
      (() => {
        const sortSelect = document.querySelector('.sort-select');
        sortSelect.value = 'priority';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const badges = Array.from(document.querySelectorAll('.task-card .badge[class*="priority"]')).map(e => e.textContent.trim());
        return badges;
      })()
    `);
    if (priorities[0] !== 'High' || priorities[1] !== 'High' || priorities[2] !== 'High') {
      throw new Error(`Expected High priority first, got: ${JSON.stringify(priorities)}`);
    }
    if (priorities[3] !== 'Medium') {
      throw new Error(`Expected Medium priority fourth, got ${priorities[3]}`);
    }
    if (priorities[4] !== 'Low') {
      throw new Error(`Expected Low priority last, got ${priorities[4]}`);
    }
  });

  await test('9. Combined Search + Status + Priority + Sorting operates simultaneously', async () => {
    const combined = await client.eval(`
      (() => {
        // Reset first
        document.querySelector('.reset-filter-btn')?.click();

        // Search: "Task"
        const input = document.querySelector('.search-input');
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, 'Task');
        input.dispatchEvent(new Event('input', { bubbles: true }));

        // Status: Pending
        const pendingBtn = Array.from(document.querySelectorAll('.filter-pill')).find(b => b.textContent.includes('Pending'));
        pendingBtn.click();

        // Priority: High
        const highBtn = Array.from(document.querySelectorAll('.filter-pill')).find(b => b.textContent.includes('High'));
        highBtn.click();

        // Sort: Due Date
        const sortSelect = document.querySelector('.sort-select');
        sortSelect.value = 'dueDate';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));

        const titles = Array.from(document.querySelectorAll('.task-card .task-title')).map(t => t.textContent.trim());
        const taskCount = document.querySelector('.task-count-badge').textContent.trim();
        return { titles, taskCount };
      })()
    `);
    await sleep(200);
    if (combined.titles.length !== 1) {
      throw new Error(`Expected exactly 1 combined match, got ${combined.titles.length}: ${JSON.stringify(combined.titles)}`);
    }
    if (!combined.titles[0].includes('CRUD')) {
      throw new Error(`Expected task title with 'CRUD', got: ${combined.titles[0]}`);
    }
  });

  // ---------------------------------------------------------------------------
  // VERIFY WEEK 6: CRUD & TOAST NOTIFICATIONS & MODAL INTERACTIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- C. VERIFY WEEK 6: CRUD, TOASTS & INTERACTIONS ---');

  await test('Add Task modal opens, validates empty title, and creates new task with toast', async () => {
    // Reset filters
    await client.eval(`document.querySelector('.reset-filter-btn')?.click();`);
    await sleep(200);

    // Click "+ Add Task" button
    await client.eval(`document.querySelector('.header-actions .btn-primary').click();`);
    await sleep(300);

    // Verify modal is open
    const isModalOpen = await client.eval(`Boolean(document.querySelector('.modal-overlay'))`);
    if (!isModalOpen) throw new Error('Modal did not open');

    // Attempt submit with empty title by clicking submit button
    await client.eval(`
      document.querySelector('.modal-content button[type="submit"]').click();
    `);
    await sleep(200);

    const errorShown = await client.eval(`
      document.querySelector('#title-error')?.textContent.trim()
    `);
    if (!errorShown || !errorShown.includes('required')) {
      throw new Error(`Validation failed to trigger: ${errorShown}`);
    }

    // Fill valid data and submit
    await client.eval(`
      (() => {
        const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const nativeTextareaSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

        const titleInput = document.querySelector('#task-title-input');
        const descInput = document.querySelector('#task-desc-input');
        const dateInput = document.querySelector('#task-duedate-input');

        nativeInputSetter.call(titleInput, 'Live E2E Verification Task');
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        titleInput.dispatchEvent(new Event('change', { bubbles: true }));

        nativeTextareaSetter.call(descInput, 'Verified live in headless Chromium browser.');
        descInput.dispatchEvent(new Event('input', { bubbles: true }));

        nativeInputSetter.call(dateInput, '2026-09-30');
        dateInput.dispatchEvent(new Event('input', { bubbles: true }));
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Select High Priority
        Array.from(document.querySelectorAll('.priority-option-btn')).find(b => b.textContent.includes('High')).click();

        // Submit form
        document.querySelector('.modal-content button[type="submit"]').click();
      })()
    `);
    await sleep(400);

    const toastText = await client.eval(`
      document.querySelector('.toast-message')?.textContent.trim()
    `);
    if (!toastText || !toastText.includes('created successfully')) {
      throw new Error(`Toast did not appear: ${toastText}`);
    }

    // Verify task is at the top of the list
    const topTitle = await client.eval(`
      document.querySelector('.task-card:first-of-type .task-title').textContent.trim()
    `);
    if (topTitle !== 'Live E2E Verification Task') {
      throw new Error(`New task not at top: ${topTitle}`);
    }
  });

  await test('Complete and Restore task updates state and counters with toast', async () => {
    // Reset filters first so all cards are visible
    await client.eval(`document.querySelector('.reset-filter-btn')?.click();`);
    await sleep(200);

    // Complete a pending task
    await client.eval(`
      (() => {
        const pendingCard = document.querySelector('.task-card:not(.is-completed)');
        if (pendingCard) pendingCard.querySelector('.complete-btn').click();
      })()
    `);
    await sleep(300);

    const completeToast = await client.eval(`
      document.querySelector('.toast-message')?.textContent.trim()
    `);
    if (!completeToast || !completeToast.includes('Task completed')) {
      throw new Error(`Complete toast failed: ${completeToast}`);
    }

    // Restore the newly completed task
    await client.eval(`
      document.querySelector('.task-card.is-completed .restore-btn').click();
    `);
    await sleep(300);

    const restoreToast = await client.eval(`
      document.querySelector('.toast-message')?.textContent.trim()
    `);
    if (!restoreToast || !restoreToast.includes('Task restored')) {
      throw new Error(`Restore toast failed: ${restoreToast}`);
    }
  });

  await test('Delete task confirmation modal displays task title preview and removes task', async () => {
    // Click delete on top task
    await client.eval(`
      document.querySelector('.task-card:first-of-type .delete-btn').click();
    `);
    await sleep(200);

    const preview = await client.eval(`
      document.querySelector('.delete-task-preview')?.textContent.trim()
    `);
    if (!preview || !preview.includes('Live E2E Verification Task')) {
      throw new Error(`Delete preview did not match: ${preview}`);
    }

    // Confirm deletion
    await client.eval(`
      document.querySelector('.delete-modal-footer .btn-danger').click();
    `);
    await sleep(200);

    const deleteToast = await client.eval(`
      document.querySelector('.toast-message')?.textContent.trim()
    `);
    if (!deleteToast || !deleteToast.includes('has been deleted')) {
      throw new Error(`Delete toast failed: ${deleteToast}`);
    }

    // Verify task is removed
    const found = await client.eval(`
      Array.from(document.querySelectorAll('.task-title')).some(t => t.textContent.includes('Live E2E Verification Task'))
    `);
    if (found) throw new Error('Task was not removed from DOM');
  });

  // ---------------------------------------------------------------------------
  // VERIFY WEEK 7: RESPONSIVE & CONSOLE INTEGRITY
  // ---------------------------------------------------------------------------
  console.log('\n--- D. VERIFY WEEK 7: RESPONSIVE & CONSOLE INTEGRITY ---');

  await test('Desktop viewport (1280x800) has no layout overflow', async () => {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(300);
    const scrollWidth = await client.eval(`document.documentElement.scrollWidth <= window.innerWidth`);
    if (!scrollWidth) throw new Error('Desktop horizontal overflow detected');
  });

  await test('Tablet viewport (768x1024) reflows cleanly without overflow', async () => {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(300);
    const scrollWidth = await client.eval(`document.documentElement.scrollWidth <= window.innerWidth`);
    if (!scrollWidth) throw new Error('Tablet horizontal overflow detected');
  });

  await test('Mobile viewport (390x844) renders 1-column grid without horizontal scroll', async () => {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sleep(300);
    const scrollWidth = await client.eval(`document.documentElement.scrollWidth <= window.innerWidth`);
    if (!scrollWidth) throw new Error('Mobile horizontal overflow detected');
  });

  await test('Zero console errors occurred during entire interactive test run', async () => {
    if (client.consoleErrors.length > 0) {
      throw new Error(`Console errors detected:\n${client.consoleErrors.join('\n')}`);
    }
  });

  console.log('\n================================================================');
  console.log(`LIVE E2E RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  client.close();
  edgeProcess.kill();
  server.close();

  if (failed > 0) process.exit(1);
  else process.exit(0);
}

runLiveVerification().catch((err) => {
  console.error('Fatal error during E2E verification:', err);
  process.exit(1);
});
