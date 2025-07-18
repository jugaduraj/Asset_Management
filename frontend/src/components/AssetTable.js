import React from "react";

const AssetTable = ({ assets, onEdit, onDelete, getStatusColor }) => (
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
          <td>{asset.remark}</td>
          <td>{asset.warrantyStatus}</td>
          <td>{asset.warrantyExpirationDate}</td>
          <td>
            <button className="edit-btn" onClick={() => onEdit(asset)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(asset.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AssetTable;