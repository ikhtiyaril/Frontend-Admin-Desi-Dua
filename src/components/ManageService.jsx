import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import FloatingFormService from "./FloatingFormService";

export default function ManageService() {
  const API_URL = `${import.meta.env.VITE_API_URL}/api/service`;
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus layanan ini?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

 const handleFormSubmit = async (formData) => {
  try {
    if (editingData) {
      const { data } = await axios.put(
        `${API_URL}/${editingData.id}`,
        formData // ✅ PAKAI DATA FORM
      );

      setServices(prev =>
        prev.map(s => (s.id === data.id ? data : s))
      );
    } else {
      const { data } = await axios.post(
        `${API_URL}`,
        formData // ✅ BUKAN editingData
      );

      setServices(prev => [...prev, data]);
    }
  } catch (err) {
    console.error("SUBMIT ERROR:", err);
  } finally {
    setEditingData(null);
    setShowForm(false); // 🔥 penting biar form nutup
  }
};


  const handleEditClick = (service) => {
    setEditingData(service);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Manajemen Layanan
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-2">Kelola semua layanan klinik Anda</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-blue-100">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">Nama Layanan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Deskripsi</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Durasi</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Harga</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Dokter</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Tipe</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{s.description}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-xs text-xs font-medium bg-blue-100 text-blue-800">
                      {s.duration_minutes} menit
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    Rp{s.price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      s.require_doctor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {s.require_doctor ? "Ya" : "Tidak"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xs text-xs font-medium ${
                      s.is_live ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {s.is_live ? "Video Call" : "Normal"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(s)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
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
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden max-w-4xl mx-auto space-y-4">
        {services.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
              <h3 className="text-lg font-bold text-white">{s.name}</h3>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-600">{s.description}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Durasi</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {s.duration_minutes} menit
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Harga</p>
                  <p className="text-base font-bold text-gray-900">Rp{s.price.toLocaleString('id-ID')}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Memerlukan Dokter</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    s.require_doctor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {s.require_doctor ? "Ya" : "Tidak"}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Tipe Layanan</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    s.is_live ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {s.is_live ? "Video Call" : "Normal"}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEditClick(s)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaTrash className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setEditingData(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex justify-center items-center text-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 z-50"
      >
        <FaPlus />
      </button>

      {/* Floating Form */}
      {showForm && (
        <FloatingFormService
          initialData={editingData}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}