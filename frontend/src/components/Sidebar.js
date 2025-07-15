import React from "react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Asset Management</h2>
      <ul>
        <li className="active">Dashboard</li>
        <li>Assets</li>
        <li>Categories</li>
        <li>Employees</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
