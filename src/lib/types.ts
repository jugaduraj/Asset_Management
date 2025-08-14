

export type Asset = {
  _id: string; // Changed from id to _id for MongoDB
  assetTag: string;
  hostname?: string;
  type: string;
  make?: string;
  model?: string;
  serialNo?: string;
  processor?: string;
  os?: string;
  osVersion?: string;
  ram?: string;
  hddSsd?: string;
  assignedTo?: string;
  location?: string;
  status: string;
  warrantyStatus: string;
  warrantyExpiration?: string;
  createdAt: string;
  remark?: string;
};

export type Employee = {
    _id: string; // Changed from id to _id for MongoDB
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

export type Log = {
  _id: string; // Changed from id to _id for MongoDB
  user: string;
  action: string;
  details: string;
  timestamp: string;
};
