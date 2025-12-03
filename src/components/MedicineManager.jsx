import React, { useEffect, useState } from "react";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}`;

export default function MedicineManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    price: "",
    stock: 0,
    is_prescription_required: false,
  });

  const [file, setFile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/medicine/products`);
    console.log(res.data)
    setProducts(res.data.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/api/categories`);
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" ? { slug: generateSlug(value) } : {}),
    });
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.size > 3 * 1024 * 1024) {
      alert("File too large. Max 3MB allowed.");
      e.target.value = "";
      return;
    }

    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("category_id", form.category_id);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("is_prescription_required", form.is_prescription_required);

    if (file) formData.append("image", file);
   console.log("File yang dikirim:", file);

    try {
      if (isEdit) {
        await axios.put(`${API}/api/medicine/admin/products/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${API}/api/medicine/admin/products`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setForm({
        name: "",
        slug: "",
        description: "",
        category_id: "",
        price: "",
        stock: 0,
        is_prescription_required: false,
      });
      setFile(null);
      setIsEdit(false);
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Error submitting data");
    }
  };

  const handleEdit = (p) => {
    setIsEdit(true);
    setEditId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      category_id: p.category_id,
      price: p.price,
      stock: p.stock,
      is_prescription_required: p.is_prescription_required,
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;

    try {
      await axios.delete(`${API}/api/medicine/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Error deleting");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        Product Management (Medicines)
      </h1>

      <div className="bg-white shadow-md p-6 rounded-lg border border-blue-100 mb-10">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded mt-1"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-medium">Slug (auto)</label>
            <input
              type="text"
              name="slug"
              className="w-full p-2 border rounded mt-1 bg-gray-100"
              value={form.slug}
              readOnly
            />
          </div>

          <div>
            <label className="font-medium">Category</label>
            <select
              name="category_id"
              className="w-full p-2 border rounded mt-1"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Price</label>
            <input
              type="number"
              name="price"
              className="w-full p-2 border rounded mt-1"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              className="w-full p-2 border rounded mt-1"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-medium">Image</label>
            <input
              type="file"
              name="image"
              className="w-full p-2 border rounded mt-1"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_prescription_required"
                checked={form.is_prescription_required}
                onChange={handleChange}
              />
              <span className="font-medium">Requires Prescription</span>
            </label>
          </div>

          <div className="col-span-2">
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              rows="4"
              className="w-full p-2 border rounded mt-1"
              value={form.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {isEdit ? "Save Changes" : "Add Product"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setEditId(null);
                  setForm({
                    name: "",
                    slug: "",
                    description: "",
                    category_id: "",
                    price: "",
                    stock: 0,
                    is_prescription_required: false,
                  });
                  setFile(null);
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">All Products</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-blue-50 border-b">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Category</th>
                <th className="p-3">Prescription?</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-blue-50">
                  <td className="p-3">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt=""
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">Rp {Number(p.price).toLocaleString()}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{p.category?.name}</td>
                  <td className="p-3 text-center">
                    {p.is_prescription_required ? (
                      <span className="text-red-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-green-600 font-semibold">No</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
