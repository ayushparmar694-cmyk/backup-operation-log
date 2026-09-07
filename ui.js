/**
 * UI Renderer and View Controller for Backup Operations Log
 */

const UIManager = {
  // SVG Icon definitions for fast, self-contained UI rendering
  icons: {
    checkCircle: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    xCircle: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    alertTriangle: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    edit: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
    clock: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    database: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`
  },

  /**
   * Escape HTML to prevent XSS injection
   */
  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Returns styled status badge HTML
   */
  renderStatusBadge(status) {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'passed') {
      return `<span class="status-badge badge-success">${this.icons.checkCircle} ${this.escapeHtml(status)}</span>`;
    }
    if (s === 'failed') {
      return `<span class="status-badge badge-failed">${this.icons.xCircle} ${this.escapeHtml(status)}</span>`;
    }
    if (s === 'warning') {
      return `<span class="status-badge badge-warning">${this.icons.alertTriangle} ${this.escapeHtml(status)}</span>`;
    }
    return `<span class="status-badge badge-neutral">${this.escapeHtml(status || 'N/A')}</span>`;
  },

  /**
   * Returns styled backup type badge
   */
  renderTypeBadge(type) {
    const t = (type || '').toLowerCase();
    let badgeClass = 'type-full';
    if (t === 'incremental') badgeClass = 'type-incremental';
    if (t === 'differential') badgeClass = 'type-differential';
    return `<span class="type-badge ${badgeClass}">${this.escapeHtml(type || 'Unknown')}</span>`;
  },

  /**
   * Updates top Dashboard KPI Summary Cards
   */
  renderDashboardStats() {
    const stats = window.storage.getDashboardStats();

    // Summary Card 1: Total Backups
    const totalBackupsEl = document.getElementById('stat-total-backups');
    if (totalBackupsEl) totalBackupsEl.textContent = stats.totalBackups;

    // Summary Card 2: Successful Backups (Green)
    const successBackupsEl = document.getElementById('stat-success-backups');
    if (successBackupsEl) successBackupsEl.textContent = stats.successfulBackups;

    // Summary Card 3: Failed Backups (Red)
    const failedBackupsEl = document.getElementById('stat-failed-backups');
    if (failedBackupsEl) failedBackupsEl.textContent = stats.failedBackups;

    // Summary Card 4: Restoration Tests Passed (Green)
    const restorePassedEl = document.getElementById('stat-restore-passed');
    if (restorePassedEl) restorePassedEl.textContent = stats.restorationPassed;
    const restoreRateEl = document.getElementById('stat-restore-rate');
    if (restoreRateEl) {
      restoreRateEl.textContent = `${stats.restorePassRate}% Pass (${stats.restorationPassed}/${stats.totalRestores})`;
    }

    // Summary Card 5: Integrity Checks Passed (Green)
    const integrityPassedEl = document.getElementById('stat-integrity-passed');
    if (integrityPassedEl) integrityPassedEl.textContent = stats.integrityPassed;
    const integrityRateEl = document.getElementById('stat-integrity-rate');
    if (integrityRateEl) {
      integrityRateEl.textContent = `${stats.integrityPassRate}% Pass (${stats.integrityPassed}/${stats.totalIntegrity})`;
    }
  },

  /**
   * Renders the Daily Backup Log Table
   */
  renderDailyBackupsTable(backups) {
    const tbody = document.getElementById('daily-backups-tbody');
    const countBadge = document.getElementById('daily-backups-count');
    if (!tbody) return;

    if (countBadge) countBadge.textContent = `${backups.length} records`;

    if (!backups || backups.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="table-empty">
            <div class="empty-state">
              <span class="empty-icon">${this.icons.database}</span>
              <p class="empty-title">No backup records found</p>
              <p class="empty-desc">Try adjusting your filters or click "+ Add Backup Entry" to log a new execution.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = backups.map(item => `
      <tr data-id="${this.escapeHtml(item.id)}">
        <td class="col-date font-mono">${this.escapeHtml(item.date)}</td>
        <td class="col-system font-medium">${this.escapeHtml(item.systemName)}</td>
        <td class="col-type">${this.renderTypeBadge(item.backupType)}</td>
        <td class="col-time font-mono">
          <span class="time-range">${this.escapeHtml(item.startTime || '--:--')} &rarr; ${this.escapeHtml(item.endTime || '--:--')}</span>
        </td>
        <td class="col-size font-mono text-muted">${this.escapeHtml(item.backupSize || 'N/A')}</td>
        <td class="col-status">${this.renderStatusBadge(item.status)}</td>
        <td class="col-remarks text-truncate" title="${this.escapeHtml(item.remarks || '')}">${this.escapeHtml(item.remarks || '—')}</td>
        <td class="col-actions">
          <div class="action-buttons">
            <button class="btn-icon btn-edit" title="Edit entry" onclick="window.app.openEditBackupModal('${item.id}')">
              ${this.icons.edit}
            </button>
            <button class="btn-icon btn-delete" title="Delete entry" onclick="window.app.confirmDelete('dailyBackup', '${item.id}')">
              ${this.icons.trash}
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Renders the Restoration Test Log Table
   */
  renderRestorationTestsTable(tests) {
    const tbody = document.getElementById('restoration-tests-tbody');
    const countBadge = document.getElementById('restoration-tests-count');
    if (!tbody) return;

    if (countBadge) countBadge.textContent = `${tests.length} records`;

    if (!tests || tests.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="table-empty">
            <div class="empty-state">
              <span class="empty-icon">${this.icons.database}</span>
              <p class="empty-title">No restoration test records found</p>
              <p class="empty-desc">Try adjusting your filters or click "+ Add Restoration Test" to log a drill test.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = tests.map(item => `
      <tr data-id="${this.escapeHtml(item.id)}">
        <td class="col-date font-mono">${this.escapeHtml(item.testDate)}</td>
        <td class="col-date font-mono text-muted">${this.escapeHtml(item.backupDate || '—')}</td>
        <td class="col-system font-medium">${this.escapeHtml(item.backupName)}</td>
        <td class="col-type"><span class="badge-subtle">${this.escapeHtml(item.restoreType || 'Standard')}</span></td>
        <td class="col-duration font-mono">
          <span class="duration-badge">${this.icons.clock} ${this.escapeHtml(item.restoreDuration || (item.restoreStartTime && item.restoreEndTime ? `${item.restoreStartTime} - ${item.restoreEndTime}` : '—'))}</span>
        </td>
        <td class="col-verified text-truncate" title="${this.escapeHtml(item.dataVerified || '')}">${this.escapeHtml(item.dataVerified || '—')}</td>
        <td class="col-result">${this.renderStatusBadge(item.result)}</td>
        <td class="col-remarks text-truncate" title="${this.escapeHtml(item.remarks || '')}">${this.escapeHtml(item.remarks || '—')}</td>
        <td class="col-actions">
          <div class="action-buttons">
            <button class="btn-icon btn-edit" title="Edit entry" onclick="window.app.openEditRestoreModal('${item.id}')">
              ${this.icons.edit}
            </button>
            <button class="btn-icon btn-delete" title="Delete entry" onclick="window.app.confirmDelete('restorationTest', '${item.id}')">
              ${this.icons.trash}
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Renders the Data Integrity Check Log Table
   */
  renderIntegrityChecksTable(checks) {
    const tbody = document.getElementById('integrity-checks-tbody');
    const countBadge = document.getElementById('integrity-checks-count');
    if (!tbody) return;

    if (countBadge) countBadge.textContent = `${checks.length} records`;

    if (!checks || checks.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="table-empty">
            <div class="empty-state">
              <span class="empty-icon">${this.icons.database}</span>
              <p class="empty-title">No data integrity check records found</p>
              <p class="empty-desc">Try adjusting your filters or click "+ Add Integrity Check" to log a checksum test.</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = checks.map(item => {
      const recordsCheckedFormatted = Number(item.recordsChecked || 0).toLocaleString();
      const filesCheckedFormatted = Number(item.filesChecked || 0).toLocaleString();
      const errorsCount = Number(item.errorsFound || 0);
      const errorBadge = errorsCount > 0 
        ? `<span class="badge-error-count text-danger">${errorsCount} errs</span>` 
        : `<span class="badge-zero text-success">0</span>`;

      return `
        <tr data-id="${this.escapeHtml(item.id)}">
          <td class="col-date font-mono">${this.escapeHtml(item.checkDate)}</td>
          <td class="col-system font-medium">${this.escapeHtml(item.systemName)}</td>
          <td class="col-num font-mono text-right">${recordsCheckedFormatted}</td>
          <td class="col-num font-mono text-right">${filesCheckedFormatted}</td>
          <td class="col-errors text-center">${errorBadge}</td>
          <td class="col-hash">${this.renderStatusBadge(item.checksumVerification)}</td>
          <td class="col-result">${this.renderStatusBadge(item.overallResult)}</td>
          <td class="col-remarks text-truncate" title="${this.escapeHtml(item.remarks || '')}">${this.escapeHtml(item.remarks || '—')}</td>
          <td class="col-actions">
            <div class="action-buttons">
              <button class="btn-icon btn-edit" title="Edit entry" onclick="window.app.openEditIntegrityModal('${item.id}')">
                ${this.icons.edit}
              </button>
              <button class="btn-icon btn-delete" title="Delete entry" onclick="window.app.confirmDelete('integrityCheck', '${item.id}')">
                ${this.icons.trash}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  /**
   * Modal Management Helpers
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    // Set focus to first input
    const firstInput = modal.querySelector('input:not([type=hidden]), select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    if (!document.querySelector('.modal.active')) {
      document.body.classList.remove('modal-open');
    }
  },

  /**
   * Show dynamic toast message
   */
  showToast(message, type = 'success', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = this.icons.checkCircle;
    if (type === 'danger' || type === 'error') icon = this.icons.xCircle;
    if (type === 'warning') icon = this.icons.alertTriangle;

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${this.escapeHtml(message)}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

window.ui = UIManager;
