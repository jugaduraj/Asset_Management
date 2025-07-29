
'use server';

import fs from 'fs/promises';
import path from 'path';
import { suggestAssetCategory, SuggestAssetCategoryInput } from '@/ai/flows/suggest-asset-category';
import type { Asset, Employee, LogEntry } from './types';
import appData from './data';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.ts');

async function saveData() {
  const fileContent = `
import type { Asset, Employee, LogEntry } from './types';

interface AppData {
    assets: Asset[];
    employees: Employee[];
    logs: LogEntry[];
}

const data: AppData = {
    assets: ${JSON.stringify(appData.assets, null, 2)},
    employees: ${JSON.stringify(appData.employees, null, 2)},
    logs: ${JSON.stringify(appData.logs, null, 2)},
};

// We are exporting the whole data object to be able to modify it from server actions.
// In a real-world application, this would be replaced with a database.
export default data;
`;
  await fs.writeFile(dataFilePath, fileContent, 'utf-8');
  revalidatePath('/dashboard');
}

export async function suggestCategoryAction(
  input: SuggestAssetCategoryInput
): Promise<string[]> {
  try {
    const result = await suggestAssetCategory(input);
    return result.categories;
  } catch (error) {
    console.error('Error suggesting asset category:', error);
    return [];
  }
}

// --- Data Actions ---

export async function getAssets(): Promise<Asset[]> {
    return appData.assets;
}

export async function getEmployees(): Promise<Employee[]> {
    return appData.employees;
}

export async function getLogs(): Promise<LogEntry[]> {
    return appData.logs;
}

export async function saveAsset(asset: Omit<Asset, 'id' | 'maintenanceHistory'>, id?: string) {
    const user = 'Guest User';
    if (id) {
        const index = appData.assets.findIndex(a => a.id === id);
        if (index !== -1) {
            appData.assets[index] = { ...appData.assets[index], ...asset };
            await addLog({
                action: 'Updated Asset',
                details: `Asset "${asset.name}" (${asset.assetTag}) was updated.`,
                user
            });
        }
    } else {
        const newAsset: Asset = {
            ...asset,
            id: new Date().toISOString(),
            maintenanceHistory: [],
        };
        appData.assets.push(newAsset);
        await addLog({
            action: 'Created Asset',
            details: `Asset "${newAsset.name}" (${newAsset.assetTag}) was created.`,
            user
        });
    }
    await saveData();
}

export async function deleteAsset(id: string) {
    const user = 'Guest User';
    const assetIndex = appData.assets.findIndex(a => a.id === id);
    if (assetIndex !== -1) {
        const [deletedAsset] = appData.assets.splice(assetIndex, 1);
        await addLog({
            action: 'Deleted Asset',
            details: `Asset "${deletedAsset.name}" (${deletedAsset.assetTag}) was deleted.`,
            user
        });
        await saveData();
    }
}

export async function saveMaintenanceLog(assetId: string, log: Omit<MaintenanceEntry, 'id'>) {
    const user = 'Guest User';
    const asset = appData.assets.find(a => a.id === assetId);
    if (asset) {
        const newLog = { ...log, id: new Date().toISOString() };
        asset.maintenanceHistory.push(newLog);
        await addLog({
            action: 'Logged Maintenance',
            details: `Maintenance logged for "${asset.name}": ${log.description}`,
            user
        });
        await saveData();
    }
}

export async function saveEmployee(employee: Omit<Employee, 'id' | 'avatar'>, id?: string) {
    const user = 'Guest User';
    if (id) {
        const index = appData.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            appData.employees[index] = { ...appData.employees[index], ...employee };
            await addLog({
                action: 'Updated Employee',
                details: `Employee "${employee.name}" was updated.`,
                user
            });
        }
    } else {
        const newEmployee: Employee = {
            ...employee,
            id: new Date().toISOString(),
            avatar: `https://placehold.co/40x40.png?text=${employee.name.charAt(0)}`,
        };
        appData.employees.push(newEmployee);
        await addLog({
            action: 'Created Employee',
            details: `Employee "${newEmployee.name}" was created.`,
            user
        });
    }
    await saveData();
}

export async function deleteEmployee(id: string) {
    const user = 'Guest User';
    const employeeIndex = appData.employees.findIndex(e => e.id === id);
    if (employeeIndex !== -1) {
        const [deletedEmployee] = appData.employees.splice(employeeIndex, 1);
        await addLog({
            action: 'Deleted Employee',
            details: `Employee "${deletedEmployee.name}" was deleted.`,
            user
        });
        await saveData();
    }
}

async function addLog(log: Omit<LogEntry, 'id' | 'timestamp'>) {
    const newLog: LogEntry = {
        ...log,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
    };
    appData.logs.unshift(newLog);
    // Note: We don't call saveData() here to avoid recursive loops
    // addLog is called by other actions that will call saveData() themselves.
}
