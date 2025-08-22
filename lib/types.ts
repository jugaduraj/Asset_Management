

export interface AssignmentHistory {
  assignedTo: string;
  assignedDate: string;
  returnedDate: string;
}

export interface Asset {
  _id: string;
  assetTag: string;
  hostname?: string;
  name?: string;
  type: string;
  make?: string;
  model?: string;
  serialNo?: string;
  processor?: string;
  os?: string;
  osVersion?: string;
  ram?: string;
  hddSsd?: string;
  location?: string;
  status: 'Active' | 'Inactive' | 'In Repair' | 'Retired' | 'image' | 'video' | 'document';
  warrantyStatus: 'Active' | 'Expired' | 'Not Applicable';
  warrantyExpiration?: string;
  assignedTo?: string;
  assignmentHistory?: AssignmentHistory[];
  remark?: string;
  createdAt: string;
  url?: string;
  tags?: string[];
}

export type Log = {
  _id: string; 
  user: string;
  action: string;
  details: string;
  timestamp: string;
};

export type Employee = {
    _id: string; 
    employeeId: string;
    name: string;
    email: string;
    department: string;
    designation: string;
    phone?: string;
    desktopLaptop?: string;
    assetTag?: string;
    monitor1?: string;
    monitor2?: string;
    webcam?: string;
    dStation?: string;
    headphone?: string;
    bag?: string;
    mouse?: string;
    allocationDate?: string;
    createdAt: string;
};

