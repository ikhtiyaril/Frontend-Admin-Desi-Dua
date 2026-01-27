import React, { useState, useEffect } from "react";
import { X } from "lucide-react"; // Opsional: jika Anda punya lucide-react, jika tidak bisa pakai teks "✕"

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
        name: initialData.name || "",
        slug: initialData.slug || "",
        description: initialData.description || "",
        category_id: initialData.category_id || "",
        price: initialData.price || "",
        stock: initialData.stock || 0,
        is_prescription_required: initialData.is_prescription_required || false,
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
    if (!form.name || !form.category_id || !form.price) return alert("Nama, Kategori & Harga wajib diisi!");
    onSubmit(form, file, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {initialData ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <p className="text-sm text-slate-500">Lengkapi informasi detail produk di bawah ini.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Produk</label>
              <input
                type="text"
                name="name"
                placeholder="Contoh: Paracetamol 500mg"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Slug - ReadOnly */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Slug URL</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                readOnly
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm italic"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga (Rp)</label>
              <input
                type="number"
                name="price"
                placeholder="0"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stok</label>
              <input
                type="number"
                name="stock"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Foto Produk</label>
              <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-10 w-10 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload file</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG up to 3MB</p>
                  {file && <p className="text-xs text-green-600 font-medium">Terpilih: {file.name}</p>}
                </div>
              </div>
            </div>

            {/* Prescription Checkbox */}
            <div className="md:col-span-2 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <input
                type="checkbox"
                id="is_prescription_required"
                name="is_prescription_required"
                checked={form.is_prescription_required}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="is_prescription_required" className="text-sm font-medium text-blue-800">
                Produk ini memerlukan Resep Dokter
              </label>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Produk</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Tuliskan detail indikasi, dosis, atau efek samping..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              ></textarea>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end bg-slate-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all order-2 sm:order-1"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition-all order-1 sm:order-2"
          >
            {initialData ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </div>
      </div>
    </div>
  );
}