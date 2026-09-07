/**
 * Export Manager for Backup Operations Log
 * Generates and triggers download of formatted CSV files
 */

const ExportManager = {
  /**
   * Escape CSV cell values safely according to RFC 4180
   */
  escapeCsvValue(val) {
    if (val === null || val === undefined) return '""';
    const str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return `"${str}"`;
  },

  /**
   * Download a generated string as a file
   */
  downloadFile(content, fileName, mimeType = 'text/csv;charset=utf-8;') {
    const payload = mimeType.includes('csv') ? '\uFEFF' + content : content;
    const blob = new Blob([payload], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Generate timestamp string for file names (YYYY-MM-DD)
   */
  getDateStamp() {
    const d = new Date();
    return d.toISOString().split('T')[0];
  },

  /**
   * Export Daily Backup Log to CSV
   */
  exportDailyBackupsToCsv(data) {
    const headers = [
      'Date',
      'Backup Name / System',
      'Backup Type',
      'Start Time',
      'End Time',
      'Backup Size',
      'Status',
      'Remarks'
    ];

    const rows = (data || []).map(item => [
      item.date,
      item.systemName,
      item.backupType,
      item.startTime,
      item.endTime,
      item.backupSize,
      item.status,
      item.remarks
    ]);

    const csvContent = [
      headers.map(this.escapeCsvValue).join(','),
      ...rows.map(row => row.map(this.escapeCsvValue).join(','))
    ].join('\r\n');

    this.downloadFile(csvContent, `backup_operations_daily_log_${this.getDateStamp()}.csv`);
  },

  /**
   * Export Restoration Test Log to CSV
   */
  exportRestorationTestsToCsv(data) {
    const headers = [
      'Test Date',
      'Backup Date',
      'Backup Name / System',
      'Restore Type',
      'Restore Start Time',
      'Restore End Time',
      'Restore Duration',
      'Data / Files Verified',
      'Result',
      'Remarks'
    ];

    const rows = (data || []).map(item => [
      item.testDate,
      item.backupDate,
      item.backupName,
      item.restoreType,
      item.restoreStartTime,
      item.restoreEndTime,
      item.restoreDuration,
      item.dataVerified,
      item.result,
      item.remarks
    ]);

    const csvContent = [
      headers.map(this.escapeCsvValue).join(','),
      ...rows.map(row => row.map(this.escapeCsvValue).join(','))
    ].join('\r\n');

    this.downloadFile(csvContent, `backup_operations_restoration_tests_${this.getDateStamp()}.csv`);
  },

  /**
   * Export Data Integrity Check Log to CSV
   */
  exportIntegrityChecksToCsv(data) {
    const headers = [
      'Check Date',
      'System / Database Name',
      'Records Checked',
      'Files Checked',
      'Errors Found',
      'Checksum / Hash Verification',
      'Overall Result',
      'Remarks'
    ];

    const rows = (data || []).map(item => [
      item.checkDate,
      item.systemName,
      item.recordsChecked,
      item.filesChecked,
      item.errorsFound,
      item.checksumVerification,
      item.overallResult,
      item.remarks
    ]);

    const csvContent = [
      headers.map(this.escapeCsvValue).join(','),
      ...rows.map(row => row.map(this.escapeCsvValue).join(','))
    ].join('\r\n');

    this.downloadFile(csvContent, `backup_operations_integrity_checks_${this.getDateStamp()}.csv`);
  },

  /**
   * Export all datasets as a complete multi-section CSV audit log
   */
  exportFullAuditCsv(db) {
    const sections = [];
    const dateStamp = this.getDateStamp();

    // Section 1: Daily Backups
    sections.push(`"=== SECTION 1: DAILY BACKUP EXECUTION LOG (Exported: ${dateStamp}) ==="`);
    const backupHeaders = ['Date', 'Backup Name / System', 'Backup Type', 'Start Time', 'End Time', 'Backup Size', 'Status', 'Remarks'];
    sections.push(backupHeaders.map(this.escapeCsvValue).join(','));
    (db.dailyBackups || []).forEach(b => {
      sections.push([b.date, b.systemName, b.backupType, b.startTime, b.endTime, b.backupSize, b.status, b.remarks].map(this.escapeCsvValue).join(','));
    });

    sections.push(''); // blank separator
    sections.push(`"=== SECTION 2: BACKUP RESTORATION TEST DRILLS ==="`);
    const restoreHeaders = ['Test Date', 'Backup Date', 'Backup Name', 'Restore Type', 'Start Time', 'End Time', 'Duration', 'Data Verified', 'Result', 'Remarks'];
    sections.push(restoreHeaders.map(this.escapeCsvValue).join(','));
    (db.restorationTests || []).forEach(r => {
      sections.push([r.testDate, r.backupDate, r.backupName, r.restoreType, r.restoreStartTime, r.restoreEndTime, r.restoreDuration, r.dataVerified, r.result, r.remarks].map(this.escapeCsvValue).join(','));
    });

    sections.push(''); // blank separator
    sections.push(`"=== SECTION 3: DATA INTEGRITY CHECKS ==="`);
    const integrityHeaders = ['Check Date', 'System / Database Name', 'Records Checked', 'Files Checked', 'Errors Found', 'Checksum Verification', 'Overall Result', 'Remarks'];
    sections.push(integrityHeaders.map(this.escapeCsvValue).join(','));
    (db.integrityChecks || []).forEach(i => {
      sections.push([i.checkDate, i.systemName, i.recordsChecked, i.filesChecked, i.errorsFound, i.checksumVerification, i.overallResult, i.remarks].map(this.escapeCsvValue).join(','));
    });

    const fullCsv = sections.join('\r\n');
    this.downloadFile(fullCsv, `backup_operations_full_audit_${dateStamp}.csv`);
  }
};

window.exportManager = ExportManager;
