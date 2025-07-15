import React, { useEffect, useState } from "react";
import "./AssetFormModal.css";

const AssetFormModal = ({ isOpen, onClose, onSubmit, asset }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    assignedTo: "",
    purchase_date: "",
    status: "",
  });

  useEffect(() => {
    if (asset) {
      setForm(asset);
    } else {
      setForm({
        name: "",
        category: "",
        assignedTo: "",
        purchase_date: "",
        status: "",
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
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="assignedTo" placeholder="Assigned To" value={form.assignedTo} onChange={handleChange} />
          <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} required />
          <select name="status" value={form.status} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Assigned">Assigned</option>
            <option value="Unassigned">Unassigned</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
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
