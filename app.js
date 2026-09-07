/**
 * Main Application Controller for Backup Operations Log
 */

class AppController {
  constructor() {
    this.activeTab = 'dailyBackups';
    this.pendingDelete = null;

    this.filters = {
      dailyBackups: {
        search: '',
        dateFrom: '',
        dateTo: '',
        status: 'ALL',
        backupType: 'ALL'
      },
      restorationTests: {
        search: '',
        dateFrom: '',
        dateTo: '',
        result: 'ALL'
      },
      integrityChecks: {
        search: '',
        dateFrom: '',
        dateTo: '',
        result: 'ALL'
      }
    };
  }

  /**
   * Initializes the application
   */
  init() {
    this.setupTabs();
    this.setupFilterListeners();
    this.setupModalForms();
    this.setupGlobalControls();
    this.refreshAll();
  }

  /**
   * Refreshes dashboard statistics and active table views
   */
  refreshAll() {
    window.ui.renderDashboardStats();
    this.refreshCurrentTab();
  }

  /**
   * Refreshes the currently active tab's table
   */
  refreshCurrentTab() {
    if (this.activeTab === 'dailyBackups') {
      const data = this.getFilteredDailyBackups();
      window.ui.renderDailyBackupsTable(data);
    } else if (this.activeTab === 'restorationTests') {
      const data = this.getFilteredRestorationTests();
      window.ui.renderRestorationTestsTable(data);
    } else if (this.activeTab === 'integrityChecks') {
      const data = this.getFilteredIntegrityChecks();
      window.ui.renderIntegrityChecksTable(data);
    }
  }

  // ==========================================
  // Tab Navigation
  // ==========================================

  setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-nav-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;

    // Update nav button states
    document.querySelectorAll('.tab-nav-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update tab pane visibility
    document.querySelectorAll('.tab-pane').forEach(pane => {
      if (pane.id === `tab-${tabName}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    this.refreshCurrentTab();
  }

  // ==========================================
  // Filtering & Search Logic
  // ==========================================

  setupFilterListeners() {
    // Tab 1: Daily Backups
    const searchDaily = document.getElementById('daily-search');
    if (searchDaily) {
      searchDaily.addEventListener('input', (e) => {
        this.filters.dailyBackups.search = e.target.value.toLowerCase().trim();
        this.refreshCurrentTab();
      });
    }

    const dateFromDaily = document.getElementById('daily-date-from');
    if (dateFromDaily) {
      dateFromDaily.addEventListener('change', (e) => {
        this.filters.dailyBackups.dateFrom = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const dateToDaily = document.getElementById('daily-date-to');
    if (dateToDaily) {
      dateToDaily.addEventListener('change', (e) => {
        this.filters.dailyBackups.dateTo = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const statusDaily = document.getElementById('daily-status-filter');
    if (statusDaily) {
      statusDaily.addEventListener('change', (e) => {
        this.filters.dailyBackups.status = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const typeDaily = document.getElementById('daily-type-filter');
    if (typeDaily) {
      typeDaily.addEventListener('change', (e) => {
        this.filters.dailyBackups.backupType = e.target.value;
        this.refreshCurrentTab();
      });
    }

    // Tab 2: Restoration Tests
    const searchRestore = document.getElementById('restore-search');
    if (searchRestore) {
      searchRestore.addEventListener('input', (e) => {
        this.filters.restorationTests.search = e.target.value.toLowerCase().trim();
        this.refreshCurrentTab();
      });
    }

    const dateFromRestore = document.getElementById('restore-date-from');
    if (dateFromRestore) {
      dateFromRestore.addEventListener('change', (e) => {
        this.filters.restorationTests.dateFrom = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const dateToRestore = document.getElementById('restore-date-to');
    if (dateToRestore) {
      dateToRestore.addEventListener('change', (e) => {
        this.filters.restorationTests.dateTo = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const resultRestore = document.getElementById('restore-result-filter');
    if (resultRestore) {
      resultRestore.addEventListener('change', (e) => {
        this.filters.restorationTests.result = e.target.value;
        this.refreshCurrentTab();
      });
    }

    // Tab 3: Integrity Checks
    const searchIntegrity = document.getElementById('integrity-search');
    if (searchIntegrity) {
      searchIntegrity.addEventListener('input', (e) => {
        this.filters.integrityChecks.search = e.target.value.toLowerCase().trim();
        this.refreshCurrentTab();
      });
    }

    const dateFromIntegrity = document.getElementById('integrity-date-from');
    if (dateFromIntegrity) {
      dateFromIntegrity.addEventListener('change', (e) => {
        this.filters.integrityChecks.dateFrom = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const dateToIntegrity = document.getElementById('integrity-date-to');
    if (dateToIntegrity) {
      dateToIntegrity.addEventListener('change', (e) => {
        this.filters.integrityChecks.dateTo = e.target.value;
        this.refreshCurrentTab();
      });
    }

    const resultIntegrity = document.getElementById('integrity-result-filter');
    if (resultIntegrity) {
      resultIntegrity.addEventListener('change', (e) => {
        this.filters.integrityChecks.result = e.target.value;
        this.refreshCurrentTab();
      });
    }
  }

  /**
   * Reset filters for a specific tab
   */
  resetFilters(tabKey) {
    if (tabKey === 'dailyBackups') {
      this.filters.dailyBackups = { search: '', dateFrom: '', dateTo: '', status: 'ALL', backupType: 'ALL' };
      document.getElementById('daily-search').value = '';
      document.getElementById('daily-date-from').value = '';
      document.getElementById('daily-date-to').value = '';
      document.getElementById('daily-status-filter').value = 'ALL';
      document.getElementById('daily-type-filter').value = 'ALL';
    } else if (tabKey === 'restorationTests') {
      this.filters.restorationTests = { search: '', dateFrom: '', dateTo: '', result: 'ALL' };
      document.getElementById('restore-search').value = '';
      document.getElementById('restore-date-from').value = '';
      document.getElementById('restore-date-to').value = '';
      document.getElementById('restore-result-filter').value = 'ALL';
    } else if (tabKey === 'integrityChecks') {
      this.filters.integrityChecks = { search: '', dateFrom: '', dateTo: '', result: 'ALL' };
      document.getElementById('integrity-search').value = '';
      document.getElementById('integrity-date-from').value = '';
      document.getElementById('integrity-date-to').value = '';
      document.getElementById('integrity-result-filter').value = 'ALL';
    }
    this.refreshCurrentTab();
  }

  /**
   * Quick filter by KPI card click
   */
  quickFilterStatus(status) {
    this.switchTab('dailyBackups');
    this.resetFilters('dailyBackups');
    this.filters.dailyBackups.status = status;
    const select = document.getElementById('daily-status-filter');
    if (select) select.value = status;
    this.refreshCurrentTab();
  }

  getFilteredDailyBackups() {
    const list = window.storage.getDailyBackups();
    const { search, dateFrom, dateTo, status, backupType } = this.filters.dailyBackups;

    return list.filter(item => {
      // Status filter
      if (status !== 'ALL' && item.status !== status) return false;

      // Type filter
      if (backupType !== 'ALL' && item.backupType !== backupType) return false;

      // Date range filter
      if (dateFrom && item.date < dateFrom) return false;
      if (dateTo && item.date > dateTo) return false;

      // Search term
      if (search) {
        const text = `${item.systemName} ${item.date} ${item.status} ${item.remarks || ''} ${item.backupSize || ''} ${item.backupType || ''}`.toLowerCase();
        if (!text.includes(search)) return false;
      }

      return true;
    });
  }

  getFilteredRestorationTests() {
    const list = window.storage.getRestorationTests();
    const { search, dateFrom, dateTo, result } = this.filters.restorationTests;

    return list.filter(item => {
      // Result filter
      if (result !== 'ALL' && item.result !== result) return false;

      // Date range filter
      if (dateFrom && item.testDate < dateFrom) return false;
      if (dateTo && item.testDate > dateTo) return false;

      // Search term
      if (search) {
        const text = `${item.backupName} ${item.testDate} ${item.backupDate || ''} ${item.result} ${item.restoreType || ''} ${item.dataVerified || ''} ${item.remarks || ''}`.toLowerCase();
        if (!text.includes(search)) return false;
      }

      return true;
    });
  }

  getFilteredIntegrityChecks() {
    const list = window.storage.getIntegrityChecks();
    const { search, dateFrom, dateTo, result } = this.filters.integrityChecks;

    return list.filter(item => {
      // Result filter
      if (result !== 'ALL' && item.overallResult !== result) return false;

      // Date range filter
      if (dateFrom && item.checkDate < dateFrom) return false;
      if (dateTo && item.checkDate > dateTo) return false;

      // Search term
      if (search) {
        const text = `${item.systemName} ${item.checkDate} ${item.overallResult} ${item.checksumVerification || ''} ${item.remarks || ''}`.toLowerCase();
        if (!text.includes(search)) return false;
      }

      return true;
    });
  }

  // ==========================================
  // Modal Forms & CRUD Handlers
  // ==========================================

  setupModalForms() {
    // 1. Daily Backup Form
    const backupForm = document.getElementById('modal-backup-form');
    if (backupForm) {
      backupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveBackup();
      });
    }

    // 2. Restoration Test Form
    const restoreForm = document.getElementById('modal-restore-form');
    if (restoreForm) {
      restoreForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveRestore();
      });

      // Auto calculate duration on time change
      const startTimeInput = document.getElementById('restore-modal-start-time');
      const endTimeInput = document.getElementById('restore-modal-end-time');
      const durationInput = document.getElementById('restore-modal-duration');

      const calcDuration = () => {
        const start = startTimeInput.value;
        const end = endTimeInput.value;
        if (start && end) {
          const [sh, sm] = start.split(':').map(Number);
          const [eh, em] = end.split(':').map(Number);
          let diffMin = (eh * 60 + em) - (sh * 60 + sm);
          if (diffMin < 0) diffMin += 24 * 60; // Next day wrap
          if (diffMin < 60) {
            durationInput.value = `${diffMin} mins`;
          } else {
            const hrs = Math.floor(diffMin / 60);
            const remMin = diffMin % 60;
            durationInput.value = remMin > 0 ? `${hrs}h ${remMin}m` : `${hrs} hours`;
          }
        }
      };

      if (startTimeInput && endTimeInput && durationInput) {
        startTimeInput.addEventListener('change', calcDuration);
        endTimeInput.addEventListener('change', calcDuration);
      }
    }

    // 3. Integrity Check Form
    const integrityForm = document.getElementById('modal-integrity-form');
    if (integrityForm) {
      integrityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveIntegrity();
      });
    }

    // Modal Close buttons (by class .btn-modal-close or backdrop)
    document.querySelectorAll('.btn-modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) window.ui.closeModal(modal.id);
      });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) window.ui.closeModal(activeModal.id);
      }
    });
  }

  // --- Daily Backup CRUD ---

  openAddBackupModal() {
    const form = document.getElementById('modal-backup-form');
    form.reset();
    document.getElementById('backup-modal-id').value = '';
    document.getElementById('backup-modal-title').textContent = 'Add Daily Backup Entry';
    
    // Default today's date and times
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('backup-modal-date').value = today;
    document.getElementById('backup-modal-status').value = 'Success';
    document.getElementById('backup-modal-type').value = 'Full';

    window.ui.openModal('modal-backup');
  }

  openEditBackupModal(id) {
    const item = window.storage.getBackupById(id);
    if (!item) return;

    document.getElementById('backup-modal-id').value = item.id;
    document.getElementById('backup-modal-title').textContent = 'Edit Backup Entry';
    document.getElementById('backup-modal-date').value = item.date || '';
    document.getElementById('backup-modal-system').value = item.systemName || '';
    document.getElementById('backup-modal-type').value = item.backupType || 'Full';
    document.getElementById('backup-modal-start-time').value = item.startTime || '';
    document.getElementById('backup-modal-end-time').value = item.endTime || '';
    document.getElementById('backup-modal-size').value = item.backupSize || '';
    document.getElementById('backup-modal-status').value = item.status || 'Success';
    document.getElementById('backup-modal-remarks').value = item.remarks || '';

    window.ui.openModal('modal-backup');
  }

  handleSaveBackup() {
    const id = document.getElementById('backup-modal-id').value;
    const entry = {
      date: document.getElementById('backup-modal-date').value,
      systemName: document.getElementById('backup-modal-system').value.trim(),
      backupType: document.getElementById('backup-modal-type').value,
      startTime: document.getElementById('backup-modal-start-time').value,
      endTime: document.getElementById('backup-modal-end-time').value,
      backupSize: document.getElementById('backup-modal-size').value.trim(),
      status: document.getElementById('backup-modal-status').value,
      remarks: document.getElementById('backup-modal-remarks').value.trim()
    };

    if (!entry.date || !entry.systemName) {
      window.ui.showToast('Please provide Date and System Name', 'warning');
      return;
    }

    if (id) {
      window.storage.updateDailyBackup(id, entry);
      window.ui.showToast(`Updated backup log for ${entry.systemName}`, 'success');
    } else {
      window.storage.addDailyBackup(entry);
      window.ui.showToast(`Added backup log for ${entry.systemName}`, 'success');
    }

    window.ui.closeModal('modal-backup');
    this.refreshAll();
  }

  // --- Restoration Test CRUD ---

  openAddRestoreModal() {
    const form = document.getElementById('modal-restore-form');
    form.reset();
    document.getElementById('restore-modal-id').value = '';
    document.getElementById('restore-modal-title').textContent = 'Add Restoration Test Entry';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('restore-modal-test-date').value = today;
    document.getElementById('restore-modal-backup-date').value = today;
    document.getElementById('restore-modal-result').value = 'Passed';
    document.getElementById('restore-modal-type').value = 'Granular File Recovery';

    window.ui.openModal('modal-restore');
  }

  openEditRestoreModal(id) {
    const item = window.storage.getRestoreById(id);
    if (!item) return;

    document.getElementById('restore-modal-id').value = item.id;
    document.getElementById('restore-modal-title').textContent = 'Edit Restoration Test';
    document.getElementById('restore-modal-test-date').value = item.testDate || '';
    document.getElementById('restore-modal-backup-date').value = item.backupDate || '';
    document.getElementById('restore-modal-system').value = item.backupName || '';
    document.getElementById('restore-modal-type').value = item.restoreType || 'Full System Restore';
    document.getElementById('restore-modal-start-time').value = item.restoreStartTime || '';
    document.getElementById('restore-modal-end-time').value = item.restoreEndTime || '';
    document.getElementById('restore-modal-duration').value = item.restoreDuration || '';
    document.getElementById('restore-modal-verified').value = item.dataVerified || '';
    document.getElementById('restore-modal-result').value = item.result || 'Passed';
    document.getElementById('restore-modal-remarks').value = item.remarks || '';

    window.ui.openModal('modal-restore');
  }

  handleSaveRestore() {
    const id = document.getElementById('restore-modal-id').value;
    const entry = {
      testDate: document.getElementById('restore-modal-test-date').value,
      backupDate: document.getElementById('restore-modal-backup-date').value,
      backupName: document.getElementById('restore-modal-system').value.trim(),
      restoreType: document.getElementById('restore-modal-type').value,
      restoreStartTime: document.getElementById('restore-modal-start-time').value,
      restoreEndTime: document.getElementById('restore-modal-end-time').value,
      restoreDuration: document.getElementById('restore-modal-duration').value.trim(),
      dataVerified: document.getElementById('restore-modal-verified').value.trim(),
      result: document.getElementById('restore-modal-result').value,
      remarks: document.getElementById('restore-modal-remarks').value.trim()
    };

    if (!entry.testDate || !entry.backupName) {
      window.ui.showToast('Please provide Test Date and Backup Name', 'warning');
      return;
    }

    if (id) {
      window.storage.updateRestorationTest(id, entry);
      window.ui.showToast(`Updated restoration drill for ${entry.backupName}`, 'success');
    } else {
      window.storage.addRestorationTest(entry);
      window.ui.showToast(`Added restoration drill for ${entry.backupName}`, 'success');
    }

    window.ui.closeModal('modal-restore');
    this.refreshAll();
  }

  // --- Integrity Check CRUD ---

  openAddIntegrityModal() {
    const form = document.getElementById('modal-integrity-form');
    form.reset();
    document.getElementById('integrity-modal-id').value = '';
    document.getElementById('integrity-modal-title').textContent = 'Add Data Integrity Check Entry';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('integrity-modal-date').value = today;
    document.getElementById('integrity-modal-records').value = '0';
    document.getElementById('integrity-modal-files').value = '0';
    document.getElementById('integrity-modal-errors').value = '0';
    document.getElementById('integrity-modal-hash').value = 'Passed';
    document.getElementById('integrity-modal-result').value = 'Passed';

    window.ui.openModal('modal-integrity');
  }

  openEditIntegrityModal(id) {
    const item = window.storage.getIntegrityCheckById(id);
    if (!item) return;

    document.getElementById('integrity-modal-id').value = item.id;
    document.getElementById('integrity-modal-title').textContent = 'Edit Data Integrity Check';
    document.getElementById('integrity-modal-date').value = item.checkDate || '';
    document.getElementById('integrity-modal-system').value = item.systemName || '';
    document.getElementById('integrity-modal-records').value = item.recordsChecked || 0;
    document.getElementById('integrity-modal-files').value = item.filesChecked || 0;
    document.getElementById('integrity-modal-errors').value = item.errorsFound || 0;
    document.getElementById('integrity-modal-hash').value = item.checksumVerification || 'Passed';
    document.getElementById('integrity-modal-result').value = item.overallResult || 'Passed';
    document.getElementById('integrity-modal-remarks').value = item.remarks || '';

    window.ui.openModal('modal-integrity');
  }

  handleSaveIntegrity() {
    const id = document.getElementById('integrity-modal-id').value;
    const entry = {
      checkDate: document.getElementById('integrity-modal-date').value,
      systemName: document.getElementById('integrity-modal-system').value.trim(),
      recordsChecked: Number(document.getElementById('integrity-modal-records').value) || 0,
      filesChecked: Number(document.getElementById('integrity-modal-files').value) || 0,
      errorsFound: Number(document.getElementById('integrity-modal-errors').value) || 0,
      checksumVerification: document.getElementById('integrity-modal-hash').value,
      overallResult: document.getElementById('integrity-modal-result').value,
      remarks: document.getElementById('integrity-modal-remarks').value.trim()
    };

    if (!entry.checkDate || !entry.systemName) {
      window.ui.showToast('Please provide Check Date and System Name', 'warning');
      return;
    }

    if (id) {
      window.storage.updateIntegrityCheck(id, entry);
      window.ui.showToast(`Updated integrity check for ${entry.systemName}`, 'success');
    } else {
      window.storage.addIntegrityCheck(entry);
      window.ui.showToast(`Added integrity check for ${entry.systemName}`, 'success');
    }

    window.ui.closeModal('modal-integrity');
    this.refreshAll();
  }

  // --- Deletion Confirmation ---

  confirmDelete(type, id) {
    let displayName = id;
    if (type === 'dailyBackup') {
      const item = window.storage.getBackupById(id);
      displayName = item ? `${item.systemName} (${item.date})` : id;
    } else if (type === 'restorationTest') {
      const item = window.storage.getRestoreById(id);
      displayName = item ? `${item.backupName} (${item.testDate})` : id;
    } else if (type === 'integrityCheck') {
      const item = window.storage.getIntegrityCheckById(id);
      displayName = item ? `${item.systemName} (${item.checkDate})` : id;
    }

    this.pendingDelete = { type, id, displayName };
    const nameEl = document.getElementById('confirm-delete-name');
    if (nameEl) nameEl.textContent = displayName;
    window.ui.openModal('modal-confirm-delete');
  }

  executeDelete() {
    if (!this.pendingDelete) return;
    const { type, id, displayName } = this.pendingDelete;

    let deleted = false;
    if (type === 'dailyBackup') {
      deleted = window.storage.deleteDailyBackup(id);
    } else if (type === 'restorationTest') {
      deleted = window.storage.deleteRestorationTest(id);
    } else if (type === 'integrityCheck') {
      deleted = window.storage.deleteIntegrityCheck(id);
    }

    window.ui.closeModal('modal-confirm-delete');
    this.pendingDelete = null;

    if (deleted) {
      window.ui.showToast(`Deleted ${displayName}`, 'success');
      this.refreshAll();
    } else {
      window.ui.showToast('Record could not be found or was already deleted', 'warning');
    }
  }

  // ==========================================
  // Global Actions & Export / Import
  // ==========================================

  setupGlobalControls() {
    // Delete confirm button
    const deleteBtn = document.getElementById('btn-execute-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.executeDelete());
    }

    // CSV Export for active tab
    const exportActiveBtn = document.getElementById('btn-export-active-tab');
    if (exportActiveBtn) {
      exportActiveBtn.addEventListener('click', () => this.exportActiveTabCsv());
    }

    // CSV Export Full Audit
    const exportAllBtn = document.getElementById('btn-export-all-csv');
    if (exportAllBtn) {
      exportAllBtn.addEventListener('click', () => {
        const db = window.storage.getDatabase();
        window.exportManager.exportFullAuditCsv(db);
        window.ui.showToast('Full Audit CSV exported successfully!', 'success');
      });
    }

    // JSON Backup Download
    const backupJsonBtn = document.getElementById('btn-backup-json');
    if (backupJsonBtn) {
      backupJsonBtn.addEventListener('click', () => {
        const jsonStr = window.storage.exportJson();
        const stamp = window.exportManager.getDateStamp();
        window.exportManager.downloadFile(jsonStr, `backup_operations_db_${stamp}.json`, 'application/json');
        window.ui.showToast('Database JSON backup downloaded', 'success');
      });
    }

    // JSON Import Upload
    const importInput = document.getElementById('input-import-json');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          const res = window.storage.importJson(evt.target.result);
          if (res.success) {
            window.ui.showToast(`Database imported successfully (${res.count} items)`, 'success');
            this.refreshAll();
          } else {
            window.ui.showToast(`Import failed: ${res.error}`, 'danger');
          }
          importInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    // Reset Demo Data
    const resetDemoBtn = document.getElementById('btn-reset-demo');
    if (resetDemoBtn) {
      resetDemoBtn.addEventListener('click', () => {
        if (confirm('Reset all records back to the initial sample demo data? Any custom logs will be overwritten.')) {
          window.storage.resetToDemoData();
          window.ui.showToast('Reset to demo sample records', 'success');
          this.refreshAll();
        }
      });
    }
  }

  exportActiveTabCsv() {
    if (this.activeTab === 'dailyBackups') {
      const data = this.getFilteredDailyBackups();
      window.exportManager.exportDailyBackupsToCsv(data);
      window.ui.showToast(`Exported ${data.length} Daily Backup records to CSV`, 'success');
    } else if (this.activeTab === 'restorationTests') {
      const data = this.getFilteredRestorationTests();
      window.exportManager.exportRestorationTestsToCsv(data);
      window.ui.showToast(`Exported ${data.length} Restoration Test records to CSV`, 'success');
    } else if (this.activeTab === 'integrityChecks') {
      const data = this.getFilteredIntegrityChecks();
      window.exportManager.exportIntegrityChecksToCsv(data);
      window.ui.showToast(`Exported ${data.length} Data Integrity records to CSV`, 'success');
    }
  }
}

// Instantiate and initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
  window.app.init();
});
