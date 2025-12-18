import React, { useState, useEffect } from "react";

export default function FloatingFormProduct({ onClose, onSubmit, categories, initialData }) {
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

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description,
        category_id: initialData.category_id,
        price: initialData.price,
        stock: initialData.stock,
        is_prescription_required: initialData.is_prescription_required,
      });
      setFile(null);
    }
  }, [initialData]);

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" ? { slug: generateSlug(value) } : {}),
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category_id || !form.price) return alert("Name, Category & Price required!");
    onSubmit(form, file, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center pt-20 z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl border border-blue-200"
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-5">
          {initialData ? "Edit Product" : "Tambah Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="font-medium">Slug (auto)</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              readOnly
              className="w-full p-2 border rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="font-medium">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="is_prescription_required"
              checked={form.is_prescription_required}
              onChange={handleChange}
            />
            <span className="font-medium">Requires Prescription</span>
          </div>

          <div className="col-span-2">
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded mt-1"
            ></textarea>
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Tutup</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {initialData ? "Update" : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
