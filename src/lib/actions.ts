
'use server';

import { suggestAssetCategory, SuggestAssetCategoryInput } from '@/ai/flows/suggest-asset-category';
import type { Asset, Employee, LogEntry, MaintenanceEntry } from './types';
import { pool } from './database';
import { revalidatePath } from 'next/cache';

// AI Action remains the same
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

async function addLog(log: Omit<LogEntry, 'id' | 'timestamp'>) {
    const newLog: Omit<LogEntry, 'id'> = {
        ...log,
        timestamp: new Date().toISOString(),
    };
    const [result] = await pool.execute(
        'INSERT INTO logs (timestamp, user, action, details) VALUES (?, ?, ?, ?)',
        [newLog.timestamp, newLog.user, newLog.action, newLog.details]
    );
    // No revalidation needed here as logs are not displayed on the main dashboard page directly in a way that requires it.
}


export async function getAssets(): Promise<Asset[]> {
    const [rows] = await pool.query('SELECT * FROM assets');
    const assets = (rows as any[]).map(asset => ({
        ...asset,
        maintenanceHistory: JSON.parse(asset.maintenanceHistory || '[]'),
        purchaseDate: new Date(asset.purchaseDate).toISOString().split('T')[0],
        warrantyExpirationDate: asset.warrantyExpirationDate ? new Date(asset.warrantyExpirationDate).toISOString().split('T')[0] : undefined,
    }));
    return assets;
}

export async function getEmployees(): Promise<Employee[]> {
    const [rows] = await pool.query('SELECT * FROM employees');
    const employees = (rows as any[]).map(employee => ({
        ...employee,
        assets: JSON.parse(employee.assets || '{}'),
        allocationDate: employee.allocationDate ? new Date(employee.allocationDate).toISOString().split('T')[0] : undefined,
    }));
    return employees;
}

export async function getLogs(): Promise<LogEntry[]> {
    const [rows] = await pool.query('SELECT * FROM logs ORDER BY timestamp DESC');
    return (rows as any[]).map(log => ({
        ...log,
        timestamp: new Date(log.timestamp).toISOString(),
    }));
}

export async function saveAsset(asset: Omit<Asset, 'id' | 'maintenanceHistory'>, id?: string) {
    const user = 'Guest User';
    const assetToSave = {
        ...asset,
        maintenanceHistory: id ? undefined : '[]', // Don't update history on save, only set for new.
    };
    
    // Remove fields that are not in the database or handled separately
    const { maintenanceHistory, ...dbAsset } = assetToSave;

    if (id) {
        await pool.execute(
            `UPDATE assets SET 
                assetTag = ?, name = ?, type = ?, make = ?, model = ?, serialNumber = ?, processor = ?, os = ?, osVersion = ?, 
                ram = ?, storage = ?, location = ?, status = ?, assignedUser = ?, remark = ?, warrantyStatus = ?, 
                warrantyExpirationDate = ?, purchaseDate = ?, department = ?, category = ?, licenseInfo = ?
            WHERE id = ?`,
            [
                dbAsset.assetTag, dbAsset.name, dbAsset.type, dbAsset.make, dbAsset.model, dbAsset.serialNumber, dbAsset.processor,
                dbAsset.os, dbAsset.osVersion, dbAsset.ram, dbAsset.storage, dbAsset.location, dbAsset.status, dbAsset.assignedUser,
                dbAsset.remark, dbAsset.warrantyStatus, dbAsset.warrantyExpirationDate, dbAsset.purchaseDate, dbAsset.department,
                dbAsset.category, dbAsset.licenseInfo, id
            ]
        );
        await addLog({
            action: 'Updated Asset',
            details: `Asset "${asset.name}" (${asset.assetTag}) was updated.`,
            user
        });
    } else {
        const newAsset = { ...dbAsset, maintenanceHistory: '[]' };
        const [result] = await pool.execute(
            `INSERT INTO assets (
                assetTag, name, type, make, model, serialNumber, processor, os, osVersion, ram, storage, location, status, 
                assignedUser, remark, warrantyStatus, warrantyExpirationDate, purchaseDate, department, category, licenseInfo, maintenanceHistory
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                newAsset.assetTag, newAsset.name, newAsset.type, newAsset.make, newAsset.model, newAsset.serialNumber, newAsset.processor,
                newAsset.os, newAsset.osVersion, newAsset.ram, newAsset.storage, newAsset.location, newAsset.status, newAsset.assignedUser,
                newAsset.remark, newAsset.warrantyStatus, newAsset.warrantyExpirationDate, newAsset.purchaseDate, newAsset.department,
                newAsset.category, newAsset.licenseInfo, newAsset.maintenanceHistory
            ]
        );
        await addLog({
            action: 'Created Asset',
            details: `Asset "${asset.name}" (${asset.assetTag}) was created.`,
            user
        });
    }
    revalidatePath('/dashboard');
}

export async function deleteAsset(id: string) {
    const user = 'Guest User';
    const [rows]: any[] = await pool.query('SELECT name, assetTag FROM assets WHERE id = ?', [id]);
    const asset = rows[0];

    if (asset) {
        await pool.execute('DELETE FROM assets WHERE id = ?', [id]);
        await addLog({
            action: 'Deleted Asset',
            details: `Asset "${asset.name}" (${asset.assetTag}) was deleted.`,
            user
        });
        revalidatePath('/dashboard');
    }
}

export async function saveMaintenanceLog(assetId: string, log: Omit<MaintenanceEntry, 'id'>) {
    const user = 'Guest User';
    const [rows]: any[] = await pool.query('SELECT name, maintenanceHistory FROM assets WHERE id = ?', [assetId]);
    const asset = rows[0];

    if (asset) {
        const newLog = { ...log, id: new Date().toISOString() };
        const history = JSON.parse(asset.maintenanceHistory || '[]');
        history.push(newLog);
        await pool.execute('UPDATE assets SET maintenanceHistory = ? WHERE id = ?', [JSON.stringify(history), assetId]);
        
        await addLog({
            action: 'Logged Maintenance',
            details: `Maintenance logged for "${asset.name}": ${log.description}`,
            user
        });
        revalidatePath('/dashboard');
    }
}


export async function saveEmployee(employee: Omit<Employee, 'id' | 'avatar'>, id?: string) {
    const user = 'Guest User';
    const employeeToSave = {
        ...employee,
        assets: JSON.stringify(employee.assets),
    };

    if (id) {
        await pool.execute(
            'UPDATE employees SET name = ?, email = ?, contactNo = ?, department = ?, role = ?, assets = ? WHERE id = ?',
            [
                employeeToSave.name, employeeToSave.email, employeeToSave.contactNo, employeeToSave.department,
                employeeToSave.role, employeeToSave.assets, id
            ]
        );
        await addLog({
            action: 'Updated Employee',
            details: `Employee "${employee.name}" was updated.`,
            user
        });
    } else {
        const newEmployee = { ...employeeToSave, avatar: `https://placehold.co/40x40.png?text=${employee.name.charAt(0)}` };
        await pool.execute(
            'INSERT INTO employees (name, email, contactNo, department, role, avatar, assets) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                newEmployee.name, newEmployee.email, newEmployee.contactNo, newEmployee.department,
                newEmployee.role, newEmployee.avatar, newEmployee.assets
            ]
        );
        await addLog({
            action: 'Created Employee',
            details: `Employee "${newEmployee.name}" was created.`,
            user
        });
    }
    revalidatePath('/dashboard');
}

export async function deleteEmployee(id: string) {
    const user = 'Guest User';
    const [rows]: any[] = await pool.query('SELECT name FROM employees WHERE id = ?', [id]);
    const employee = rows[0];

    if (employee) {
        await pool.execute('DELETE FROM employees WHERE id = ?', [id]);
        await addLog({
            action: 'Deleted Employee',
            details: `Employee "${employee.name}" was deleted.`,
            user
        });
        revalidatePath('/dashboard');
    }
}
