/**
 * Backup Operations Log - Sample Demo Dataset
 * Realistic seed records for IT Operations & Disaster Recovery tracking
 */

const SAMPLE_DAILY_BACKUPS = [
  {
    id: "bk-1001",
    date: "2026-08-22",
    systemName: "Prod-PostgreSQL-Cluster",
    backupType: "Full",
    startTime: "01:00",
    endTime: "02:45",
    backupSize: "485.4 GB",
    status: "Success",
    remarks: "Automated nightly pg_dump & WAL archive to S3 vault. Verified replica sync."
  },
  {
    id: "bk-1002",
    date: "2026-08-22",
    systemName: "FileServer-NAS-01",
    backupType: "Incremental",
    startTime: "02:00",
    endTime: "02:35",
    backupSize: "42.8 GB",
    status: "Success",
    remarks: "ZFS snapshot replication to offsite DR storage unit."
  },
  {
    id: "bk-1003",
    date: "2026-08-22",
    systemName: "AD-Domain-Controller-01",
    backupType: "Full",
    startTime: "03:00",
    endTime: "03:22",
    backupSize: "18.2 GB",
    status: "Success",
    remarks: "System State & Active Directory database backup completed without errors."
  },
  {
    id: "bk-1004",
    date: "2026-08-22",
    systemName: "Customer-Portal-VM",
    backupType: "Incremental",
    startTime: "03:30",
    endTime: "04:12",
    backupSize: "68.5 GB",
    status: "Warning",
    remarks: "High I/O latency during snapshot creation. Backup finished with 2 non-critical file locks skipped."
  },
  {
    id: "bk-1005",
    date: "2026-08-22",
    systemName: "Billing-Archive-ColdStorage",
    backupType: "Full",
    startTime: "04:00",
    endTime: "04:18",
    backupSize: "120.0 GB",
    status: "Failed",
    remarks: "Target S3 bucket permission error (HTTP 403 Forbidden). IAM role credential renewal required. Ticket #IT-8842."
  },
  {
    id: "bk-1006",
    date: "2026-08-21",
    systemName: "Prod-PostgreSQL-Cluster",
    backupType: "Incremental",
    startTime: "01:00",
    endTime: "01:42",
    backupSize: "94.6 GB",
    status: "Success",
    remarks: "Continuous WAL archiving completed smoothly."
  },
  {
    id: "bk-1007",
    date: "2026-08-21",
    systemName: "FileServer-NAS-01",
    backupType: "Incremental",
    startTime: "02:00",
    endTime: "02:40",
    backupSize: "39.1 GB",
    status: "Success",
    remarks: "Sync delta transfer ok."
  },
  {
    id: "bk-1008",
    date: "2026-08-21",
    systemName: "ERP-SQL-Cluster",
    backupType: "Full",
    startTime: "02:30",
    endTime: "04:10",
    backupSize: "620.8 GB",
    status: "Success",
    remarks: "Full SQL Server database backup with T-Log truncation."
  },
  {
    id: "bk-1009",
    date: "2026-08-20",
    systemName: "Mail-Server-Exchange",
    backupType: "Full",
    startTime: "00:30",
    endTime: "02:50",
    backupSize: "340.5 GB",
    status: "Success",
    remarks: "Information Store & mailbox database backup verified."
  },
  {
    id: "bk-1010",
    date: "2026-08-20",
    systemName: "GitLab-SelfHosted-Server",
    backupType: "Full",
    startTime: "03:15",
    endTime: "04:05",
    backupSize: "85.2 GB",
    status: "Success",
    remarks: "Repository bundles, secrets, and database dumped and encrypted."
  },
  {
    id: "bk-1011",
    date: "2026-08-19",
    systemName: "Legacy-CRM-MySQL",
    backupType: "Full",
    startTime: "01:15",
    endTime: "01:30",
    backupSize: "14.5 GB",
    status: "Failed",
    remarks: "Disk space full on temporary spool partition /var/tmp/backup. Cleared stale logs. Ticket #IT-8819."
  }
];

const SAMPLE_RESTORATION_TESTS = [
  {
    id: "rst-2001",
    testDate: "2026-08-21",
    backupDate: "2026-08-20",
    backupName: "Prod-PostgreSQL-Cluster",
    restoreType: "Point-in-Time Database",
    restoreStartTime: "10:00",
    restoreEndTime: "10:48",
    restoreDuration: "48 mins",
    dataVerified: "Restored snapshot to staging instance. Verified 2.4M user records and ran schema integrity queries.",
    result: "Passed",
    remarks: "Recovery Point Objective (RPO) within 5 mins, Recovery Time Objective (RTO) well under 2hr target."
  },
  {
    id: "rst-2002",
    testDate: "2026-08-18",
    backupDate: "2026-08-17",
    backupName: "FileServer-NAS-01",
    restoreType: "Granular File Recovery",
    restoreStartTime: "14:15",
    restoreEndTime: "14:32",
    restoreDuration: "17 mins",
    dataVerified: "Restored 15 random department folders (Finance, HR, Legal). Validated PDF and XLSX checksums.",
    result: "Passed",
    remarks: "Files restored with original NTFS permissions and timestamps intact."
  },
  {
    id: "rst-2003",
    testDate: "2026-08-15",
    backupDate: "2026-08-14",
    backupName: "AD-Domain-Controller-01",
    restoreType: "Full System Restore",
    restoreStartTime: "09:30",
    restoreEndTime: "10:25",
    restoreDuration: "55 mins",
    dataVerified: "Restored to isolated virtual lab. Tested Kerberos authentication and DNS record resolution.",
    result: "Passed",
    remarks: "Non-authoritative restore test successful. DC promoted cleanly in sandbox network."
  },
  {
    id: "rst-2004",
    testDate: "2026-08-10",
    backupDate: "2026-08-09",
    backupName: "Legacy-CRM-MySQL",
    restoreType: "Database Table/Point-in-Time",
    restoreStartTime: "15:00",
    restoreEndTime: "15:45",
    restoreDuration: "45 mins",
    dataVerified: "Attempted table-level restore of customer_contacts and orders tables.",
    result: "Failed",
    remarks: "Foreign key constraint violation during restore due to missing lookup tables snapshot. Runbook updated. Ticket #IT-8790."
  },
  {
    id: "rst-2005",
    testDate: "2026-08-05",
    backupDate: "2026-08-04",
    backupName: "Customer-Portal-VM",
    restoreType: "VM Instant Recovery",
    restoreStartTime: "11:00",
    restoreEndTime: "11:20",
    restoreDuration: "20 mins",
    dataVerified: "Instant VM boot from NFS backup repository. Verified web service responding on port 443.",
    result: "Passed",
    remarks: "Instant spin-up within 20 mins. DR SLA compliant."
  }
];

const SAMPLE_INTEGRITY_CHECKS = [
  {
    id: "chk-3001",
    checkDate: "2026-08-22",
    systemName: "Prod-PostgreSQL-Cluster",
    recordsChecked: 3840000,
    filesChecked: 520,
    errorsFound: 0,
    checksumVerification: "Passed",
    overallResult: "Passed",
    remarks: "SHA-256 block checksums matched secondary replica. 0 corrupted blocks detected by amcheck extension."
  },
  {
    id: "chk-3002",
    checkDate: "2026-08-21",
    systemName: "ERP-SQL-Cluster",
    recordsChecked: 8920500,
    filesChecked: 1450,
    errorsFound: 0,
    checksumVerification: "Passed",
    overallResult: "Passed",
    remarks: "DBCC CHECKDB executed with 0 allocation or consistency errors."
  },
  {
    id: "chk-3003",
    checkDate: "2026-08-20",
    systemName: "FileServer-NAS-01",
    recordsChecked: 145000,
    filesChecked: 78900,
    errorsFound: 3,
    checksumVerification: "Passed",
    overallResult: "Warning",
    remarks: "ZFS scrub completed. 3 damaged blocks detected in user temp archive and repaired automatically from mirror pool."
  },
  {
    id: "chk-3004",
    checkDate: "2026-08-19",
    systemName: "Billing-Archive-S3",
    recordsChecked: 2450000,
    filesChecked: 42300,
    errorsFound: 0,
    checksumVerification: "Passed",
    overallResult: "Passed",
    remarks: "MD5 etag verification against cloud inventory manifest confirmed 100% match."
  },
  {
    id: "chk-3005",
    checkDate: "2026-08-14",
    systemName: "Legacy-CRM-MySQL",
    recordsChecked: 680000,
    filesChecked: 320,
    errorsFound: 14,
    checksumVerification: "Failed",
    overallResult: "Failed",
    remarks: "MyISAM table index corruption detected on audit_logs table. Repaired with myisamchk; scheduled migration to InnoDB. Ticket #IT-8802."
  }
];
