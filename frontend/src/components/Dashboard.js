import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
    maintenance: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/assets")
      .then((res) => {
        const data = res.data;
        setStats({
          total: data.length,
          assigned: data.filter((asset) => asset.assigned).length,
          unassigned: data.filter((asset) => !asset.assigned).length,
          maintenance: data.filter((asset) => asset.maintenance).length,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddAsset = (newAsset) => {
    axios
      .post("http://localhost:8000/assets", newAsset)
      .then((res) => setAssets((prev) => [res.data, ...prev]))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>
      <div className="cards">
        <div className="card">
          <h4>Total Assets</h4>
          <p>{stats.total}</p>
        </div>
        <div className="card">
          <h4>Assigned</h4>
          <p>{stats.assigned}</p>
        </div>
        <div className="card">
          <h4>Unassigned</h4>
          <p>{stats.unassigned}</p>
        </div>
        <div className="card">
          <h4>Under Maintenance</h4>
          <p>{stats.maintenance}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;