import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3001/api/products");
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:3001/api/products/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post("http://localhost:3001/api/products", form);
    }
    setForm({ name: "", description: "", price: "", imageUrl: "" });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3001/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="container">
      <h1>🛍 Product Catalog</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required></textarea>
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
      </form>

      <div className="grid">
        {products.map((product) => (
          <div className="card" key={product._id}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>${product.price}</strong>
            <div className="actions">
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
