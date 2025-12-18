import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaPlus, FaUserMd } from "react-icons/fa";
import axios from "axios";
import FloatingFormDoctor from "./FloatingFormDoctor";

export default function ManageDoctor() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor`);
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleSubmit = async (formData, id) => {
    try {
      let res;
      if (id) {
        res = await axios.put(`${API_URL}/api/doctor/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" }});
        if (res.data.success) setDoctors(prev => prev.map(d => d.id === id ? res.data.data : d));
      } else {
        res = await axios.post(`${API_URL}/api/doctor`, formData, { headers: { "Content-Type": "multipart/form-data" }});
        if (res.data.success) setDoctors(prev => [...prev, res.data.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (doc) => {
    setEditDoctor(doc);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus dokter ini?")) return;
    try {
      const res = await axios.delete(`${API_URL}/api/doctor/${id}`);
      if (res.data.success) setDoctors(prev => prev.filter(d => d.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <FaUserMd className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Manajemen Dokter
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Kelola data dokter dan spesialis</p>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">Dokter</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Kontak</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Spesialisasi</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {doctors.map(doc => (
                <tr key={doc.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={doc.avatar || "https://via.placeholder.com/40"} 
                        alt={doc.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{doc.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{doc.email}</p>
                      <p className="text-gray-600">{doc.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {doc.specialization}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      doc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {doctors.length === 0 && (
            <div className="text-center py-12">
              <FaUserMd className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-sm font-medium text-gray-900">Belum ada dokter</h3>
              <p className="mt-1 text-sm text-gray-500">Klik tombol + untuk menambah dokter baru</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden max-w-4xl mx-auto space-y-4">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center gap-3">
              <img 
                src={doc.avatar || "https://via.placeholder.com/40"} 
                alt={doc.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  doc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {doc.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-sm text-gray-900">{doc.email}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Telepon</p>
                  <p className="text-sm text-gray-900">{doc.phone}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Spesialisasi</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {doc.specialization}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(doc)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaTrash className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State Mobile */}
        {doctors.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-12 text-center">
            <FaUserMd className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-base font-medium text-gray-900">Belum ada dokter</h3>
            <p className="mt-2 text-sm text-gray-500">Klik tombol + untuk menambah dokter baru</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => { setEditDoctor(null); setShowForm(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex justify-center items-center text-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 z-50"
      >
        <FaPlus />
      </button>

      {/* Floating Form */}
      {showForm && (
        <FloatingFormDoctor
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          initialData={editDoctor}
        />
      )}
    </div>
  );
}