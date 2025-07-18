import React from "react";

const Dashboard = ({ stats }) => (
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