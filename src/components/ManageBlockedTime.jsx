import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ManageBlockedTime() {
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [newBlock, setNewBlock] = useState({
    time_start: "",
    time_end: "",
  });

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${API}/api/doctor`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctors(res.data.data);
      } catch (err) {
        console.error("Gagal fetch doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch blocked times when doctor/date changes
  useEffect(() => {
    if (!selectedDoctor || !date) return;

    const fetchBlockedTimes = async () => {
      try {
        const res = await axios.get(
          `${API}/api/blocked-time/doctor/${selectedDoctor}/date/${date}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBlockedTimes(res.data);
      } catch (err) {
        console.error("Gagal fetch blocked times:", err);
      }
    };

    fetchBlockedTimes();
  }, [selectedDoctor, date]);

  const handleAddBlock = async () => {
    if (!newBlock.time_start || !newBlock.time_end) {
      alert("Jam mulai dan jam akhir wajib diisi!");
      return;
    }

    try {
      await axios.post(
        `${API}/api/blocked-time`,
        {
          doctor_id: selectedDoctor,
          date,
          time_start: newBlock.time_start,
          time_end: newBlock.time_end,
          booked_by: null, // admin block
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Blocked time berhasil ditambahkan!");
      setNewBlock({ time_start: "", time_end: "" });

      // Refresh list
      const res = await axios.get(
        `${API}/api/blocked-time/doctor/${selectedDoctor}/date/${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlockedTimes(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan blocked time!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus blocked time ini?")) return;

    try {
      await axios.delete(`${API}/api/blocked-time/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlockedTimes((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus blocked time!");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Blocked Time</h1>

      {/* Select Doctor */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Pilih Dokter</label>
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">-- Pilih Dokter --</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Date */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Tanggal</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Add new blocked time */}
      {selectedDoctor && date && (
        <div className="mb-6 border p-4 rounded-lg bg-gray-50">
          <h2 className="font-semibold mb-2">Tambah Blocked Time</h2>

          <div className="mb-2">
            <label className="block font-medium mb-1">Jam Mulai</label>
            <input
              type="time"
              value={newBlock.time_start}
              onChange={(e) =>
                setNewBlock((prev) => ({ ...prev, time_start: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium mb-1">Jam Akhir</label>
            <input
              type="time"
              value={newBlock.time_end}
              onChange={(e) =>
                setNewBlock((prev) => ({ ...prev, time_end: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={handleAddBlock}
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Tambah Blocked Time
          </button>
        </div>
      )}

      {/* List blocked times */}
      <div className="grid gap-2">
        {blockedTimes.map((b) => (
          <div
            key={b.id}
            className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm"
          >
            <div>
              <p>
                <span className="font-semibold">Time:</span> {b.time_start} -{" "}
                {b.time_end} {b.date}
              </p>
              {b.booked_by && (
                <p className="text-sm text-gray-500">
                  (Auto blocked by Booking #{b.booked_by})
                </p>
              )}
            </div>

            {!b.booked_by && (
              <button
                onClick={() => handleDelete(b.id)}
                className="text-red-600 font-semibold hover:underline"
              >
                Hapus
              </button>
            )}
          </div>
        ))}

        {blockedTimes.length === 0 && (
          <p className="text-gray-500">Belum ada blocked time</p>
        )}
      </div>
    </div>
  );
}
