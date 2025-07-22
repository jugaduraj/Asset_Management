
export type AssetHistoryEvent = {
  date: string;
  type: "Repair" | "Software Installation" | "Maintenance" | "Created";
  description: string;
};

export type Asset = {
  assetTag: string;
  hostName: string;
  assetType: string;
  category: string;
  make: string;
  model: string;
  serialNumber: string;
  processor: string;
  os: string;
  osVersion: string;
  ram: string;
  hddSsd: string;
  location: string;
  status: 'Assigned' | 'Unassigned' | 'Under Maintenance';
  assignedTo: string;
  remark: string;
  warrantyStatus: string;
  warrantyExpiration: string;
  value: number;
  history: AssetHistoryEvent[];
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  status: "Active" | "On Leave" | "Terminated";
  avatarUrl?: string;
};
