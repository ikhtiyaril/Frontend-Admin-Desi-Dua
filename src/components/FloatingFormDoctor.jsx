import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FloatingFormDoctor({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    avatar: "",
    isActive: true,
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFile = (e) => {
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
    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    if (file) fd.append("avatar", file);

    onSubmit(fd, form.id); // kirim FormData + id (jika edit)
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-start pt-20 z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-blue-200"
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-5">
          {initialData ? "Edit Dokter" : "Tambah Dokter"}
        </h3>

        <div className="flex flex-col gap-4">
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama Dokter" className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Dokter" className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400" required />
          <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Nomor HP" className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400" required />
          <input type="text" name="specialization" value={form.specialization} onChange={handleChange} placeholder="Spesialisasi" className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400" />
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio Dokter" className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400" />
          <input type="file" onChange={handleFile} className="w-full" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-5 w-5" />
            Aktif
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Tutup</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{initialData ? "Update" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
}
