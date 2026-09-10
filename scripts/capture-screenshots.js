import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'screenshots');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 4173;

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Simple MIME types map
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};

// Start static server for dist
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
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function capture(name, query, width = 1280, height = 800) {
  const outputPath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  const url = `http://localhost:${PORT}/${query ? '?' + query : ''}`;
  console.log(`Capturing [${name}.png] from ${url} (${width}x${height})...`);

  const args = [
    '--headless=new',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    '--hide-scrollbars',
    '--virtual-time-budget=2000',
    `--screenshot=${outputPath}`,
    url,
  ];

  try {
    await execFileAsync(EDGE_PATH, args);
    console.log(`  ✓ Successfully saved ${name}.png`);
  } catch (err) {
    console.error(`  ✗ Error capturing ${name}:`, err.message);
  }
}

async function run() {
  server.listen(PORT, async () => {
    console.log(`Static preview server listening on port ${PORT}...`);
    try {
      // 1. Dashboard (Desktop)
      await capture('dashboard', '', 1280, 800);

      // 2. Add Task Modal
      await capture('add-task', 'view=add-task', 1280, 800);

      // 3. Edit Task Modal
      await capture('edit-task', 'view=edit-task', 1280, 800);

      // 4. Completed Task View
      await capture('completed-task', 'view=completed-task', 1280, 800);

      // 5. Search + Filter + Sort View
      await capture('search-filter-sort', 'view=search-filter-sort', 1280, 800);

      // 6. Empty State View
      await capture('empty-state', 'view=empty-state', 1280, 800);

      // 7. Mobile View
      await capture('mobile-view', '', 390, 844);

      console.log('\nAll screenshots captured successfully!');
    } catch (e) {
      console.error('Screenshot capture failed:', e);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

run();
