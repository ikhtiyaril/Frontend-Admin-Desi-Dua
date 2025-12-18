import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import FloatingFormBlockedTime from "./FloatingFormBlockedTime";

export default function ManageBlockedTime() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${API}/api/doctor`, { headers: { Authorization: `Bearer ${token}` } });
        setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch blocked times when doctor/date changes
  useEffect(() => {
    if (!selectedDoctor || !date) return;
    const fetchBlockedTimes = async () => {
      try {
        const res = await axios.get(`${API}/api/blocked-time/doctor/${selectedDoctor}/date/${date}`, { headers: { Authorization: `Bearer ${token}` } });
        setBlockedTimes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlockedTimes();
  }, [selectedDoctor, date]);

  const handleAddBlock = async (data) => {
    try {
      await axios.post(`${API}/api/blocked-time`, data, { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.get(`${API}/api/blocked-time/doctor/${selectedDoctor}/date/${date}`, { headers: { Authorization: `Bearer ${token}` } });
      setBlockedTimes(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan blocked time!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus blocked time ini?")) return;
    try {
      await axios.delete(`${API}/api/blocked-time/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBlockedTimes(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus blocked time!");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Blocked Time</h1>

      {/* Select Doctor */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Pilih Dokter</label>
        <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
          <option value="">-- Pilih Dokter --</option>
          {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
        </select>
      </div>

      {/* Select Date */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tanggal</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
      </div>

      {/* Tabel Blocked Time */}
      {selectedDoctor && date && (
        <div className="relative">
          <table className="w-full table-auto bg-white rounded-xl border border-blue-100 shadow-md">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="px-4 py-2">Time Start</th>
                <th className="px-4 py-2">Time End</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {blockedTimes.length > 0 ? blockedTimes.map(b => (
                <tr key={b.id} className="border-b border-blue-100 hover:bg-blue-50">
                  <td className="px-4 py-2">{b.time_start}</td>
                  <td className="px-4 py-2">{b.time_end}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="text-center py-4 text-gray-500">Belum ada blocked time</td></tr>
              )}
            </tbody>
          </table>

          {/* Tombol Floating + */}
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex justify-center items-center text-2xl hover:bg-blue-700 transition"
          >
            <FaPlus />
          </button>
        </div>
      )}

      {/* Floating Form */}
      {showForm && (
        <FloatingFormBlockedTime
          onClose={() => setShowForm(false)}
          onSubmit={handleAddBlock}
          doctorId={selectedDoctor}
          date={date}
        />
      )}
    </div>
  );
}
