import React, { useEffect, useState } from "react";
import "./AssetFormModal.css";

const AssetFormModal = ({ isOpen, onClose, onSubmit, asset }) => {
  const [form, setForm] = useState({
    assetTag: "",
    hostName: "",
    assetType: "",
    make: "",
    model: "",
    serialNo: "",
    processor: "",
    os: "",
    osVersion: "",
    ram: "",
    hddSsd: "",
    location: "",
    status: "",
    remark: "",
    warrantyStatus: "",
    warrantyExpirationDate: "",
    assignedTo: "",
    purchase_date: "",
  });

  useEffect(() => {
    if (asset) {
      setForm(asset);
    } else {
      setForm({
        assetTag: "",
        hostName: "",
        assetType: "",
        make: "",
        model: "",
        serialNo: "",
        processor: "",
        os: "",
        osVersion: "",
        ram: "",
        hddSsd: "",
        location: "",
        status: "",
        remark: "",
        warrantyStatus: "",
        warrantyExpirationDate: "",
        assignedTo: "",
        purchase_date: "",
      });
    }
  }, [asset]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{asset ? "Edit Asset" : "Add Asset"}</h2>
        <form onSubmit={handleSubmit}>
          <input name="assetTag" placeholder="Asset Tag" value={form.assetTag} onChange={handleChange} required />
          <input name="hostName" placeholder="Host Name" value={form.hostName} onChange={handleChange} required />
          <input name="assetType" placeholder="Asset Type" value={form.assetType} onChange={handleChange} required />
          <input name="make" placeholder="Make" value={form.make} onChange={handleChange} required />
          <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
          <input name="serialNo" placeholder="Serial No." value={form.serialNo} onChange={handleChange} required />
          <input name="processor" placeholder="Processor" value={form.processor} onChange={handleChange} required />
          <input name="os" placeholder="OS" value={form.os} onChange={handleChange} required />
          <input name="osVersion" placeholder="OS Version" value={form.osVersion} onChange={handleChange} required />
          <input name="ram" placeholder="RAM" value={form.ram} onChange={handleChange} required />
          <input name="hddSsd" placeholder="HDD/SSD" value={form.hddSsd} onChange={handleChange} required />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Assigned">Assigned</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
          <input name="remark" placeholder="Remark" value={form.remark} onChange={handleChange} />
          <input name="warrantyStatus" placeholder="Warranty Status" value={form.warrantyStatus} onChange={handleChange} required />
          <input type="date" name="warrantyExpirationDate" placeholder="Warranty Expiration Date" value={form.warrantyExpirationDate} onChange={handleChange} required />
          <input name="assignedTo" placeholder="Assigned To" value={form.assignedTo} onChange={handleChange} />
          <input type="date" name="purchase_date" placeholder="Purchase Date" value={form.purchase_date} onChange={handleChange} required />
          <div className="modal-buttons">
            <button type="submit" className="edit-btn">Save</button>
            <button type="button" className="delete-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetFormModal;
