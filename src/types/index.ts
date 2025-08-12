export interface AssetFile {
  name: string;
  url: string;
  size: string;
  type: string;
}

export type AssetStatus = "Active" | "Inactive" | "In Use" | "In Stock" | "Maintenance" | "Retired";
export type AssetCategory = "Hardware" | "Software" | "Equipment";
export type WarrantyStatus = "Active" | "Expired" | "Not Applicable";

export interface Asset {
  id: string; // uuid in db
  assetTag: string;
  hostName: string | null;
  type: string; // asset_type in db
  make: string | null;
  model: string | null;
  serialNo: string | null;
  processor: string | null;
  os: string | null;
  osVersion: string | null;
  ram: string | null;
  hddSsd: string | null;
  location: string | null;
  status: AssetStatus;
  remark: string | null; // was notes
  warrantyStatus: WarrantyStatus;
  warrantyExpiration: string | null; // was warrantyEndDate, is date in db
  createdAt: string; // timestamptz in db
  updatedAt: string; // timestamptz in db
  assignedTo: string | null; // uuid in db
  assignedEmployee?: Employee;
}

export interface Employee {
  id: string; // uuid in db
  employeeId: string;
  name: string;
  email: string | null;
  department: string | null;
  designation: string | null; // was role
  phone: string | null;
  createdAt: string; // timestamptz in db
  updatedAt: string; // timestamptz in db
  desktop_laptop: string | null;
  asset_tag: string | null;
  monitor_1: string | null;
  monitor_2: string | null;
  webcam_dstation: string | null;
  headphone: string | null;
  bag_mouse: string | null;
  allocation_date: string | null; // date in db
}

export interface Log {
  id: string;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  avatarUrl?: string;
}
