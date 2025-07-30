
import type { Asset, Employee, LogEntry } from './types';

// This file is now a fallback and won't be actively used if the database connection is successful.
// It's good practice to keep it for local testing or as a backup.

interface AppData {
    assets: Asset[];
    employees: Employee[];
    logs: LogEntry[];
}

const data: AppData = {
    assets: [],
    employees: [],
    logs: [],
};

export default data;
