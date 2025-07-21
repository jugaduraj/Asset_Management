import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import AssetFormModal from "./components/AssetFormModal";
import CategoriesPage from "./components/CategoriesPage";
import AssetTable from "./components/AssetTable";
import Dashboard from "./components/Dashboard";
import "./components/Sidebar.css";
import "./App.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");

  // Fetch assets from backend on mount
  useEffect(() => {
    axios
      .get("http://localhost:8000/assets")
      .then((res) => setAssets(res.data))
      .catch((err) => console.error("Error fetching assets:", err));
  }, []);

  const handleAddAsset = (newAsset) => {
    // Optionally, POST to backend and refresh list
    axios
      .post("http://localhost:8000/assets", newAsset)
      .then((res) => setAssets((prev) => [res.data, ...prev]))
      .catch((err) => console.error("Error adding asset:", err));
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active={activePage} onSelect={setActivePage} />
      <div className="dashboard">
        {activePage === "dashboard" && (
          <Dashboard />
        )}
        {activePage === "assets" && (
          <>
            <h1>Assets</h1>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              Add New Asset
            </button>
            <AssetTable assets={assets} />
            <AssetFormModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSubmit={handleAddAsset}
            />
          </>
        )}
        {activePage === "categories" && <CategoriesPage />}
        {activePage === "employees" && (
          <div>
            <h1>Employees</h1>
            <p>Employee management coming soon.</p>
          </div>
        )}
        {activePage === "reports" && (
          <div>
            <h1>Reports</h1>
            <p>Reports feature coming soon.</p>
          </div>
        )}
        {activePage === "settings" && (
          <div>
            <h1>Settings</h1>
            <p>Settings page coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
