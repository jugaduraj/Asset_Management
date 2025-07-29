
export type MaintenanceEntry = {
  id: string;
  date: string;
  description: string;
  cost: number;
};

export type AssetStatus = 'Active' | 'Inactive' | 'In Repair' | 'Retired';
export const assetStatuses: AssetStatus[] = ['Active', 'Inactive', 'In Repair', 'Retired'];

export type AssetType = 'Hardware' | 'Software';
export const assetTypes: AssetType[] = ['Hardware', 'Software'];

export type WarrantyStatus = 'Active' | 'Expired';
export const warrantyStatuses: WarrantyStatus[] = ['Active', 'Expired'];

export type Asset = {
  id: string;
  assetTag: string;
  name: string; // Host Name
  type: AssetType;
  make: string;
  model: string;
  serialNumber: string;
  processor?: string;
  os?: string;
  osVersion?: string;
  ram?: string;
  storage?: string; // HDD/SSD
  location?: string;
  status: AssetStatus;
  assignedUser: string;
  remark?: string;
  warrantyStatus: WarrantyStatus;
  warrantyExpirationDate?: string;
  purchaseDate: string;
  department: string;
  maintenanceHistory: MaintenanceEntry[];
  category: string; // No change, but was not in the provided list
  licenseInfo?: string; // For software
};

export type EmployeeAsset = {
  desktopLaptop?: string;
  assetTag?: string;
  monitor1?: string;
  monitor2?: string;
  webcamDockingStation?: string;
  headphone?: string;
  bagMouse?: string;
  allocationDate?: string;
}

export type Employee = {
  id: string;
  name: string;
  email: string;
  contactNo: string;
  department: string;
  role: string;
  avatar: string;
  assets: EmployeeAsset;
};

export type LogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
};
