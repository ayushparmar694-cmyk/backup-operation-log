/**
 * Storage Manager for Backup Operations Log
 * Handles LocalStorage persistence, CRUD operations, statistics, and import/export
 */

const STORAGE_KEY = 'BACKUP_OPS_LOG_DB_V1';

class StorageManager {
  constructor() {
    this.init();
  }

  /**
   * Initializes local storage with sample data if no data currently exists.
   */
  init() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.resetToDemoData();
      }
    } catch (e) {
      console.error('LocalStorage access error:', e);
    }
  }

  /**
   * Retrieves the full database object from LocalStorage.
   */
  getDatabase() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { dailyBackups: [], restorationTests: [], integrityChecks: [] };
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing stored logs:', e);
      return { dailyBackups: [], restorationTests: [], integrityChecks: [] };
    }
  }

  /**
   * Saves the entire database object to LocalStorage.
   */
  saveDatabase(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return true;
    } catch (e) {
      console.error('Error saving logs to LocalStorage:', e);
      return false;
    }
  }

  /**
   * Resets the application data back to default demo records.
   */
  resetToDemoData() {
    const demoDb = {
      dailyBackups: [...SAMPLE_DAILY_BACKUPS],
      restorationTests: [...SAMPLE_RESTORATION_TESTS],
      integrityChecks: [...SAMPLE_INTEGRITY_CHECKS],
      lastUpdated: new Date().toISOString()
    };
    this.saveDatabase(demoDb);
    return demoDb;
  }

  /**
   * Generates a unique ID for new records.
   */
  generateId(prefix = 'rec') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  }

  // ==========================================
  // Daily Backup Log CRUD
  // ==========================================

  getDailyBackups() {
    const db = this.getDatabase();
    return (db.dailyBackups || []).sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (b.startTime || '').localeCompare(a.startTime || '');
    });
  }

  getBackupById(id) {
    const backups = this.getDailyBackups();
    return backups.find(b => b.id === id) || null;
  }

  addDailyBackup(entry) {
    const db = this.getDatabase();
    const newEntry = {
      ...entry,
      id: entry.id || this.generateId('bk')
    };
    db.dailyBackups = [newEntry, ...(db.dailyBackups || [])];
    db.lastUpdated = new Date().toISOString();
    this.saveDatabase(db);
    return newEntry;
  }

  updateDailyBackup(id, updatedFields) {
    const db = this.getDatabase();
    const index = (db.dailyBackups || []).findIndex(b => b.id === id);
    if (index === -1) return null;

    db.dailyBackups[index] = {
      ...db.dailyBackups[index],
      ...updatedFields,
      id
    };
    db.lastUpdated = new Date().toISOString();
    this.saveDatabase(db);
    return db.dailyBackups[index];
  }

  deleteDailyBackup(id) {
    const db = this.getDatabase();
    const initialLength = (db.dailyBackups || []).length;
    db.dailyBackups = (db.dailyBackups || []).filter(b => b.id !== id);
    if (db.dailyBackups.length !== initialLength) {
      db.lastUpdated = new Date().toISOString();
      this.saveDatabase(db);
      return true;
    }
    return false;
  }

  // ==========================================
  // Restoration Test Log CRUD
  // ==========================================

  getRestorationTests() {
    const db = this.getDatabase();
    return (db.restorationTests || []).sort((a, b) => {
      if (a.testDate !== b.testDate) return b.testDate.localeCompare(a.testDate);
      return (b.restoreStartTime || '').localeCompare(a.restoreStartTime || '');
    });
  }

  getRestoreById(id) {
    const tests = this.getRestorationTests();
    return tests.find(r => r.id === id) || null;
  }

  addRestorationTest(entry) {
    const db = this.getDatabase();
    const newEntry = {
      ...entry,
      id: entry.id || this.generateId('rst')
    };
    db.restorationTests = [newEntry, ...(db.restorationTests || [])];
    db.lastUpdated = new Date().toISOString();
    this.saveDatabase(db);
    return newEntry;
  }

  updateRestorationTest(id, updatedFields) {
    const db = this.getDatabase();
    const index = (db.restorationTests || []).findIndex(r => r.id === id);
    if (index === -1) return null;

    db.restorationTests[index] = {
      ...db.restorationTests[index],
      ...updatedFields,
      id
    };
    db.lastUpdated = new Date().toISOString();
    this.saveDatabase(db);
    return db.restorationTests[index];
  }

  deleteRestorationTest(id) {
    const db = this.getDatabase();
    const initialLength = (db.restorationTests || []).length;
    db.restorationTests = (db.restorationTests || []).filter(r => r.id !== id);
    if (db.restorationTests.length !== initialLength) {
      db.lastUpdated = new Date().toISOString();
      this.saveDatabase(db);
      return true;
    }
    return false;
  }

  // ==========================================
  // Data Integrity Check CRUD
  // ==========================================

  getIntegrityChecks() {
    const db = this.getDatabase();
    return (db.integrityChecks || []).sort((a, b) => {
      return b.checkDate.localeCompare(a.checkDate);
    });
  }

  getIntegrityCheckById(id) {
    const checks = this.getIntegrityChecks();
    return checks.find(i => i.id === id) || null;
  }

  addIntegrityCheck(entry) {
    const db = this.getDatabase();
    const newEntry = {
      ...entry,
      recordsChecked: Number(entry.recordsChecked) || 0,
      filesChecked: Number(entry.filesChecked) || 0,
      errorsFound: Number(entry.errorsFound) || 0,
      id: entry.id || this.generateId('chk')
    };
    db.integrityChecks = [newEntry, ...(db.integrityChecks || [])];
    db.lastUpdated = new Date().toISOString();
    this.saveDatabase(db);
    return newEntry;
  }

  updateIntegrityCheck(id, updatedFields) {
    const db = this.getDatabase();
    const index = (db.integrityChecks || []).findIndex(i => i.id === id);
    if (index === -1) return null;

    db.integrityChecks[index] = {
      ...db.integrityChecks[index],
      ...updatedFields,
      recordsChecked: updatedFields.recordsChecked !== undefined ? Number(updatedFields.recordsChecked) || 0 : db.integrityChecks[index].recordsChecked,
      filesChecked: updatedFields.filesChecked !== undefined ? Number(updatedFields.filesChecked) || 0 : db.integrityChecks[index].filesChecked,
      errorsFound: updatedFields.errorsFound !== undefined ? Number(updatedFields.errorsFound) || 0 : db.integrityChecks[index].errorsFound,
      id
    };
    db.lastUpdated = new Date().toISOString();
    this.saveDatabase(db);
    return db.integrityChecks[index];
  }

  deleteIntegrityCheck(id) {
    const db = this.getDatabase();
    const initialLength = (db.integrityChecks || []).length;
    db.integrityChecks = (db.integrityChecks || []).filter(i => i.id !== id);
    if (db.integrityChecks.length !== initialLength) {
      db.lastUpdated = new Date().toISOString();
      this.saveDatabase(db);
      return true;
    }
    return false;
  }

  // ==========================================
  // Dashboard Aggregates & Statistics
  // ==========================================

  getDashboardStats() {
    const db = this.getDatabase();
    const backups = db.dailyBackups || [];
    const restores = db.restorationTests || [];
    const integrity = db.integrityChecks || [];

    const totalBackups = backups.length;
    const successfulBackups = backups.filter(b => b.status === 'Success').length;
    const failedBackups = backups.filter(b => b.status === 'Failed').length;
    const warningBackups = backups.filter(b => b.status === 'Warning').length;

    const totalRestores = restores.length;
    const restorationPassed = restores.filter(r => r.result === 'Passed').length;
    const restorationFailed = restores.filter(r => r.result === 'Failed').length;

    const totalIntegrity = integrity.length;
    const integrityPassed = integrity.filter(i => i.overallResult === 'Passed').length;
    const integrityFailed = integrity.filter(i => i.overallResult === 'Failed').length;
    const integrityWarning = integrity.filter(i => i.overallResult === 'Warning').length;

    return {
      totalBackups,
      successfulBackups,
      failedBackups,
      warningBackups,
      backupSuccessRate: totalBackups > 0 ? Math.round((successfulBackups / totalBackups) * 100) : 0,

      totalRestores,
      restorationPassed,
      restorationFailed,
      restorePassRate: totalRestores > 0 ? Math.round((restorationPassed / totalRestores) * 100) : 0,

      totalIntegrity,
      integrityPassed,
      integrityFailed,
      integrityWarning,
      integrityPassRate: totalIntegrity > 0 ? Math.round((integrityPassed / totalIntegrity) * 100) : 0
    };
  }

  // ==========================================
  // Backup / Export / Import JSON
  // ==========================================

  exportJson() {
    const db = this.getDatabase();
    return JSON.stringify(db, null, 2);
  }

  importJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON format');
      }
      // Sanitize fields
      const sanitized = {
        dailyBackups: Array.isArray(parsed.dailyBackups) ? parsed.dailyBackups : [],
        restorationTests: Array.isArray(parsed.restorationTests) ? parsed.restorationTests : [],
        integrityChecks: Array.isArray(parsed.integrityChecks) ? parsed.integrityChecks : [],
        lastUpdated: new Date().toISOString()
      };
      this.saveDatabase(sanitized);
      return { success: true, count: sanitized.dailyBackups.length + sanitized.restorationTests.length + sanitized.integrityChecks.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// Global singleton instance
window.storage = new StorageManager();
