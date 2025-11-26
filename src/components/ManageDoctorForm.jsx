import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

export default function ManageDoctor() {
  const defaultPassword = "1234asdf";

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    specialization: "",
    bio: "",
    avatar: "",
    isActive: true,
  });
  const [doctors, setDoctors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL; // dari .env

  // Fetch semua dokter
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor`);
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error("Gagal fetch doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await axios.put(`${API_URL}/api/doctor/${form.id}`, form);
        if (res.data.success) {
          setDoctors((prev) => prev.map((d) => (d.id === form.id ? res.data.data : d)));
          setIsEditing(false);
        }
      } else {
        const res = await axios.post(`${API_URL}/api/doctor`, form);
        if (res.data.success) {
          setDoctors((prev) => [...prev, res.data.data]);
        }
      }

      setForm({
        id: null,
        name: "",
        email: "",
        phone: "",
        specialization: "",
        bio: "",
        avatar: "",
        isActive: true,
      });
    } catch (err) {
      console.error("Error submit doctor:", err);
    }
  };

  const handleEdit = (doctor) => {
    setForm(doctor);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus dokter ini?")) return;
    try {
      const res = await axios.delete(`${API_URL}/api/doctor/${id}`);
      if (res.data.success) {
        setDoctors((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error("Gagal hapus dokter:", err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-6">
            {isEditing ? "Edit Dokter" : "Tambah Dokter Baru"}
          </h2>

          <div className="grid grid-cols-1 gap-5">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama Dokter"
              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email Dokter"
              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500" required />
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Nomor HP"
              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500" required />
            <input type="text" name="specialization" value={form.specialization} onChange={handleChange} placeholder="Spesialisasi"
              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500" />
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio Dokter"
              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500"></textarea>
            <input type="text" name="avatar" value={form.avatar} onChange={handleChange} placeholder="Link foto/avatar"
              className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-5 w-5" />
              <span>Status Aktif</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit"
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              {isEditing ? "Update Dokter" : "Simpan Dokter"}
            </button>
            {isEditing && (
              <button onClick={() => setIsEditing(false)}
                className="mt-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold hover:bg-blue-700 transition">
                +
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white p-4 rounded-xl shadow-md border border-blue-100 flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-3">
                <img src={doc.avatar || "https://via.placeholder.com/60"} alt={doc.name}
                  className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-blue-700">{doc.name}</h3>
                  <p className="text-sm text-gray-600">{doc.specialization}</p>
                  <p className="text-sm text-gray-500">{doc.email}</p>
                  <p className="text-sm text-gray-500">{doc.phone}</p>
                  <p className="text-sm text-green-600">{doc.isActive ? "Aktif" : "Tidak Aktif"}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button onClick={() => handleEdit(doc)} className="text-blue-600 hover:text-blue-800" title="Edit"><FaEdit /></button>
                <button onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800" title="Hapus"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
