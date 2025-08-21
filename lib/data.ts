import type { Asset, Employee, Log } from './types';

export const mockAssets: Asset[] = [
  {
    _id: '1',
    assetTag: 'ASSET001',
    hostname: 'LAP-001-ADMIN',
    type: 'Laptop',
    make: 'Dell',
    model: 'XPS 15',
    serialNo: 'SN12345',
    processor: 'Intel i7',
    os: 'Windows 11',
    osVersion: '23H2',
    ram: '16GB',
    hddSsd: '512GB SSD',
    location: 'Building A, Office 101',
    status: 'Active',
    warrantyStatus: 'Active',
    warrantyExpiration: '2025-12-31T23:59:59.000Z',
    assignedTo: 'John Doe',
    remark: 'New laptop for lead developer.',
    createdAt: '2023-01-15T10:30:00.000Z',
  },
  {
    _id: '2',
    assetTag: 'ASSET002',
    hostname: 'DESK-002-HR',
    type: 'Desktop',
    make: 'HP',
    model: 'EliteDesk',
    serialNo: 'SN67890',
    processor: 'Intel i5',
    os: 'Windows 10',
    osVersion: '22H2',
    ram: '8GB',
    hddSsd: '256GB SSD',
    location: 'Building B, Office 205',
    status: 'Active',
    warrantyStatus: 'Expired',
    warrantyExpiration: '2023-06-30T23:59:59.000Z',
    assignedTo: 'Jane Smith',
    remark: 'Standard HR desktop.',
    createdAt: '2022-07-01T14:00:00.000Z',
  },
   {
    _id: '3',
    assetTag: 'ASSET003',
    hostname: 'MON-003-DEV',
    type: 'Monitor',
    make: 'LG',
    model: 'UltraWide 34"',
    serialNo: 'SN54321',
    location: 'Building A, Office 102',
    status: 'Active',
    warrantyStatus: 'Active',
    warrantyExpiration: '2026-03-15T23:59:59.000Z',
    assignedTo: 'Peter Jones',
    remark: 'Primary monitor for dev work.',
    createdAt: '2023-03-16T11:00:00.000Z',
  },
  {
    _id: '4',
    assetTag: 'ASSET004',
    hostname: 'SRV-RACK-01',
    type: 'Other',
    make: 'Supermicro',
    model: 'SYS-5019A-FTN4',
    serialNo: 'SN98765',
    location: 'Server Room',
    status: 'In Repair',
    warrantyStatus: 'Not Applicable',
    remark: 'Network card failed. Awaiting replacement part.',
    createdAt: '2021-05-20T09:00:00.000Z',
  },
   {
    _id: '5',
    assetTag: 'ASSET005',
    hostname: 'PRINTER-HQ-01',
    type: 'Printer',
    make: 'Brother',
    model: 'HL-L2390DW',
    serialNo: 'SN11223',
    location: 'Building A, Common Area',
    status: 'Active',
    warrantyStatus: 'Expired',
    warrantyExpiration: '2023-08-01T23:59:59.000Z',
    assignedTo: 'Unassigned',
    remark: 'Shared printer for the first floor.',
    createdAt: '2022-08-02T16:20:00.000Z',
  },
];

export const mockEmployees: Employee[] = [
    {
        _id: 'emp1',
        employeeId: 'E12345',
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        designation: 'Lead Developer',
        phone: '123-456-7890',
        assetTag: 'ASSET001',
        createdAt: '2022-01-10T09:00:00.000Z'
    },
    {
        _id: 'emp2',
        employeeId: 'E67890',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        department: 'Human Resources',
        designation: 'HR Manager',
        phone: '098-765-4321',
        assetTag: 'ASSET002',
        createdAt: '2021-11-20T11:30:00.000Z'
    },
    {
        _id: 'emp3',
        employeeId: 'E54321',
        name: 'Peter Jones',
        email: 'peter.jones@example.com',
        department: 'Engineering',
        designation: 'Software Engineer',
        phone: '555-555-5555',
        assetTag: 'ASSET003',
        createdAt: '2023-02-15T10:00:00.000Z'
    },
     {
        _id: 'emp4',
        employeeId: 'E98765',
        name: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        department: 'Marketing',
        designation: 'Marketing Specialist',
        phone: '111-222-3333',
        createdAt: '2023-05-01T13:45:00.000Z'
    }
];

export const mockLogs: Log[] = [
    {
        _id: 'log1',
        user: 'Admin User',
        action: 'Created Asset',
        details: 'New asset with tag ASSET001 was created.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: 'log2',
        user: 'Admin User',
        action: 'Updated Asset',
        details: 'Asset with tag ASSET002 was updated. Status changed to Inactive.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        _id: 'log3',
        user: 'Admin User',
        action: 'Created Employee',
        details: 'New employee Maria Garcia (E98765) was created.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
     {
        _id: 'log4',
        user: 'Admin User',
        action: 'User Login',
        details: 'Admin User successfully logged in.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
     {
        _id: 'log5',
        user: 'Admin User',
        action: 'Deleted Asset',
        details: 'Asset with tag ASSET00-OLD was deleted.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
]
