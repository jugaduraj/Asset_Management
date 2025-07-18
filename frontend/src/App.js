import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import AssetFormModal from "./components/AssetFormModal";
import "./components/Sidebar.css";
import "./App.css";

function App() {
  const [assets, setAssets] = useState([
  {
    id: 1001,
    assetTag: "AST-1001",
    hostName: "Host-01",
    assetType: "Laptop",
    make: "Dell",
    model: "XPS 15",
    serialNo: "SN123456",
    processor: "Intel i7",
    os: "Windows",
    osVersion: "11 Pro",
    ram: "16GB",
    hddSsd: "512GB SSD",
    location: "HQ",
    status: "Assigned",
    assignedTo: "John Smith",
    remark: "Good condition",
    warrantyStatus: "Active",
    warrantyExpirationDate: "2026-05-01",
    purchase_date: "2023-05-01",
  },
]);

  const [showModal, setShowModal] = useState(false);

  const handleAddAsset = (newAsset) => {
    setAssets((prevAssets) => [newAsset, ...prevAssets]);
  };

  const stats = {
    total: assets.length,
    assigned: assets.filter((a) => a.status === "Assigned").length,
    unassigned: assets.filter((a) => a.status === "Unassigned").length,
    maintenance: assets.filter((a) => a.status === "Under Maintenance").length,
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="add-btn" onClick={() => setShowModal(true)}>Add New Asset</button>
        </div>

        <div className="cards">
          <div className="card"><h4>Total Assets</h4><p>{stats.total}</p></div>
          <div className="card"><h4>Assigned</h4><p>{stats.assigned}</p></div>
          <div className="card"><h4>Unassigned</h4><p>{stats.unassigned}</p></div>
          <div className="card"><h4>Under Maintenance</h4><p>{stats.maintenance}</p></div>
        </div>

        <h2 style={{ marginTop: "30px" }}>Recent Assets</h2>
<table className="assets-table">
  <thead>
    <tr>
      <th>Asset Tag</th>
      <th>Host Name</th>
      <th>Asset Type</th>
      <th>Make</th>
      <th>Model</th>
      <th>Serial No.</th>
      <th>Processor</th>
      <th>OS</th>
      <th>OS Version</th>
      <th>RAM</th>
      <th>HDD/SSD</th>
      <th>Location</th>
      <th>Status</th>
      <th>Assigned To</th> {/* Add this line */}
      <th>Remark</th>
      <th>Warranty Status</th>
      <th>Warranty Expiration Date</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {assets.map((asset) => (
      <tr key={asset.id}>
        <td>{asset.assetTag}</td>
        <td>{asset.hostName}</td>
        <td>{asset.assetType}</td>
        <td>{asset.make}</td>
        <td>{asset.model}</td>
        <td>{asset.serialNo}</td>
        <td>{asset.processor}</td>
        <td>{asset.os}</td>
        <td>{asset.osVersion}</td>
        <td>{asset.ram}</td>
        <td>{asset.hddSsd}</td>
        <td>{asset.location}</td>
        <td style={{ color: getStatusColor(asset.status), fontWeight: "bold" }}>
          {asset.status}
        </td>
        <td>{asset.assignedTo}</td> {/* Add this line */}
        <td>{asset.remark}</td>
        <td>{asset.warrantyStatus}</td>
        <td>{asset.warrantyExpirationDate}</td>
        <td>
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        <AssetFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddAsset}
        />
      </div>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "Assigned") return "green";
  if (status === "Under Maintenance") return "orange";
  return "blue";
}

export default App;
