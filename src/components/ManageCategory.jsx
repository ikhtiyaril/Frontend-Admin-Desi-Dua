import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      setCategories(res.data.data);
      console.log(res.data)
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.slug) return alert("Name & slug required!");

    setLoading(true);

    try {
      if (editId) {
        await axios.put(`${API}/api/categories/${editId}`, form);
        alert("Category updated!");
      } else {
        await axios.post(`${API}/api/categories`, form);
        alert("Category created!");
      }

      setForm({ name: "", slug: "" });
      setEditId(null);
      fetchCategories();

    } catch (error) {
      alert(error?.response?.data?.message || "Error occurred");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus kategori ini?")) return;

    try {
      await axios.delete(`${API}/api/categories/${id}`);
      alert("Deleted!");
      fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, slug: cat.slug });
    setEditId(cat.id);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Manage Categories</h2>

      {/* Card Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-10 border">
        <h3 className="text-lg font-medium mb-4">
          {editId ? "Edit Category" : "Create Category"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : editId ? "Update" : "Create"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", slug: "" });
                }}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h3 className="text-lg font-medium mb-4">Category List</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Slug</th>
                <th className="p-3 border">Created</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{cat.id}</td>
                  <td className="p-3 border">{cat.name}</td>
                  <td className="p-3 border">{cat.slug}</td>
                  <td className="p-3 border">
                    {new Date(cat.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-4 py-1 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;
