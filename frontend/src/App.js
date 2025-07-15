import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import AssetFormModal from "./components/AssetFormModal";
import "./components/Sidebar.css";
import "./App.css";

function App() {
  const [assets, setAssets] = useState([
    {
      id: 1001,
      name: "Dell Laptop XPS 15",
      category: "Electronics",
      assignedTo: "John Smith",
      status: "Assigned",
      purchase_date: "2023-05-01",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleAddAsset = (newAsset) => {
    setAssets([
      ...assets,
      {
        ...newAsset,
        id: Math.floor(1000 + Math.random() * 9000),
      },
    ]);
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
              <th>Asset ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>AST-{asset.id}</td>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>{asset.assignedTo || "-"}</td>
                <td style={{ color: getStatusColor(asset.status), fontWeight: "bold" }}>
                  {asset.status}
                </td>
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
