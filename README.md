# Backup Operations Log

**Backup Operations Log** is a practical, lightweight, and responsive web application designed for IT operations and sysadmin teams to record, monitor, and audit:

1. **Daily Backup Execution** (Full / Incremental / Differential, sizes, time windows, and statuses)
2. **Backup Restoration Drills** (Recovery testing, point-in-time restores, file validation, RTO tracking)
3. **Data Integrity Checks** (Database consistency checks, SHA-256 / MD5 checksum validations, bit rot detection)

---

## Key Features

- **Dashboard KPI Cards**:
  - Total Backups recorded
  - Successful Backups (Green) with one-click quick filtering
  - Failed Backups (Red) with one-click alert filtering
  - Restoration Tests Passed with percentage SLA pass rate
  - Data Integrity Checks Passed with percentage pass rate
- **Tab 1: Daily Backup Log**:
  - Record execution date, system/database name, backup type (`Full`, `Incremental`, `Differential`), start time, end time, backup size, status (`Success`, `Failed`, `Warning`), and operational remarks.
  - Full CRUD: Add, edit, delete with confirmation modal.
  - Filter by date range, status, backup type, and instant full-text search.
  - Export table to CSV.
- **Tab 2: Restoration Test Log**:
  - Record test drill date, snapshot backup date, target system, restore type (`Granular File Recovery`, `Point-in-Time Database`, `Full System Restore`, `VM Instant Recovery`), duration (with auto-calculation from start/end times), verified files/data, result (`Passed`, `Failed`), and remarks.
  - Filter by result and date, instant search, and export to CSV.
- **Tab 3: Data Integrity Check Log**:
  - Record check date, system/database name, number of records checked, files checked, error counts, hash/checksum verification result, overall status (`Passed`, `Failed`, `Warning`), and remarks.
  - Filter by result and date, instant search, and export to CSV.
- **Full Audit CSV Export**:
  - Export all 3 categories into a unified audit log file with a single click.
- **Offline & Zero Dependencies**:
  - Powered by browser `localStorage` (`BACKUP_OPS_LOG_DB_V1`).
  - Pre-seeded with realistic IT demo records on first launch.
  - JSON Backup & Restore: Download full database snapshot or restore from a JSON file.
  - One-click "Reset Demo Data" button.

---

## How to Run

1. Open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
2. No Node.js build steps, npm installs, or backend web servers are required.
3. To serve locally via a static web server (optional):
   ```bash
   npx serve .
   # or Python:
   python -m http.server 8080
   ```

---

## Architecture & Code Structure

```
backup-operations-log/
├── index.html              # Clean semantic HTML5 layout with KPI cards, tabs, and modals
├── css/
│   └── styles.css          # IT operations dashboard theme, status badges, responsive layout
├── js/
│   ├── sample-data.js      # Realistic seed datasets for backups, restores, and integrity tests
│   ├── storage.js          # LocalStorage CRUD persistence layer and aggregate statistics
│   ├── export.js           # RFC-compliant CSV generator and JSON import/export
│   ├── ui.js               # Dynamic table rendering, status badges, modals, and toast alerts
│   └── app.js              # Application controller, tab switching, and reactive filter bindings
└── README.md               # User guide and documentation
```

---

## Future Extensibility

The codebase is structured in modular ES6 classes:
- **Cloud/Backend Integration**: Replace or extend `StorageManager` in `js/storage.js` with `fetch()` calls to a REST/GraphQL API or Supabase / Firebase backend.
- **Authentication**: Add JWT / OAuth headers to API requests without touching UI rendering modules.
- **Automated Backup Agent Webhooks**: Connect webhook endpoints to push daily logs directly into the storage layer.
