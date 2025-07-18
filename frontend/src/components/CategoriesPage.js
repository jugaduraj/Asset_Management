import React, { useState } from "react";

const initialCategories = ["Laptop", "CPU", "Monitor", "Printer", "Router"];

const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {categories.map((cat, idx) => (
          <li key={idx}>{cat}</li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add new category"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
      />
      <button onClick={handleAdd}>Add Category</button>
    </div>
  );
};

export default CategoriesPage;