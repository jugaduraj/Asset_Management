import React from "react";
import "./Sidebar.css";

const sidebarOptions = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Assets", value: "assets" },
  { label: "Categories", value: "categories" },
  { label: "Employees", value: "employees" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
];

const Sidebar = ({ active, onSelect }) => {
  return (
    <div className="sidebar">
      <h2>Asset Management</h2>
      <ul>
        {sidebarOptions.map((option) => (
          <li
            key={option.value}
            className={active === option.value ? "active" : ""}
            onClick={() => onSelect && onSelect(option.value)}
            style={{ cursor: "pointer" }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

// Usage example
<Sidebar active={activePage} onSelect={setActivePage} />
