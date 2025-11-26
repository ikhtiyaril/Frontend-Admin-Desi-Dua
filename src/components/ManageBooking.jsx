import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

// Dummy data, nanti bisa diganti fetch dari API
const dummyPatients = [
  { id: 1, name: "Budi Santoso" },
  { id: 2, name: "Melati Putri" },
  { id: 3, name: "Hendra Wijaya" },
];

const dummyServices = [
  { id: 1, name: "General Checkup" },
  { id: 2, name: "Dental Cleaning" },
  { id: 3, name: "Fisioterapi" },
];

const dummyDoctors = [
  { id: 1, name: "dr. Budi Santoso" },
  { id: 2, name: "drg. Melati Putri" },
  { id: 3, name: "dr. Hendra Wijaya" },
];

export default function ManageBooking() {
  const API_URL = `${import.meta.env.VITE_API_URL}/api/booking`;

  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    id: null,
    patient_id: "",
    service_id: "",
    doctor_id: "",
    date: "",
    time_start: "",
    time_end: "",
    status: "pending",
    notes: "",
    payment_status: "unpaid",
    payment_method: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setBookings(data);
    } catch (err) {
      console.error("Gagal fetch booking:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { data } = await axios.put(`${API_URL}/${form.id}`, form);
        setBookings((prev) => prev.map((b) => (b.id === data.id ? data : b)));
        setIsEditing(false);
      } else {
        const { data } = await axios.post(API_URL, form);
        setBookings((prev) => [...prev, data]);
      }
      setForm({
        id: null,
        patient_id: "",
        service_id: "",
        doctor_id: "",
        date: "",
        time_start: "",
        time_end: "",
        status: "pending",
        notes: "",
        payment_status: "unpaid",
        payment_method: "",
      });
    } catch (err) {
      console.error("Gagal submit booking:", err);
    }
  };

  // Edit booking
  const handleEdit = (b) => {
    setForm({ ...b });
    setIsEditing(true);
  };

  // Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus booking ini?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Gagal hapus booking:", err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 flex flex-col items-center py-10">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl border border-blue-100 mb-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-6">{isEditing ? "Edit Booking" : "Tambah Booking"}</h2>

        <div className="grid grid-cols-1 gap-4">
          <select name="patient_id" value={form.patient_id} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" required>
            <option value="">Pilih Pasien</option>
            {dummyPatients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select name="service_id" value={form.service_id} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" required>
            <option value="">Pilih Layanan</option>
            {dummyServices.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select name="doctor_id" value={form.doctor_id || ""} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">Pilih Dokter (Opsional)</option>
            {dummyDoctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-1/2 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            <input type="time" name="time_start" value={form.time_start} onChange={handleChange} className="w-1/4 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            <input type="time" name="time_end" value={form.time_end} onChange={handleChange} className="w-1/4 px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>

          <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Catatan (opsional)" className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500" />

          <select name="payment_status" value={form.payment_status} onChange={handleChange} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="unpaid">Belum Dibayar</option>
            <option value="paid">Sudah Dibayar</option>
          </select>

          <input type="text" name="payment_method" value={form.payment_method || ""} onChange={handleChange} placeholder="Metode Pembayaran (opsional)" className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">{isEditing ? "Update Booking" : "Simpan Booking"}</button>
      </form>

      {/* Booking List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white p-4 rounded-xl shadow-md border border-blue-100 flex flex-col justify-between">
            <h3 className="font-semibold text-blue-700">Booking #{b.booking_code}</h3>
            <p className="text-sm text-gray-600">Pasien: {b.patient_id}</p>
            <p className="text-sm text-gray-600">Layanan: {b.service_id}</p>
            <p className="text-sm text-gray-600">Dokter: {b.doctor_id || "Belum ditentukan"}</p>
            <p className="text-sm text-gray-500">Tanggal: {b.date}</p>
            <p className="text-sm text-gray-500">Jam: {b.time_start} - {b.time_end}</p>
            <p className="text-sm text-gray-500">Status: {b.status}</p>
            <p className="text-sm text-gray-500">Pembayaran: {b.payment_status} {b.payment_method && `(${b.payment_method})`}</p>
            {b.notes && <p className="text-sm text-gray-500">Catatan: {b.notes}</p>}

            <div className="flex justify-end gap-3 mt-3">
              <button onClick={() => handleEdit(b)} className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
              <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      {isEditing && (
        <button
          onClick={() => { setIsEditing(false); setForm({ id: null, patient_id: "", service_id: "", doctor_id: "", date: "", time_start: "", time_end: "", status: "pending", notes: "", payment_status: "unpaid", payment_method: "" }); }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex justify-center items-center text-2xl hover:bg-blue-700 transition"
        >
          <FaPlus />
        </button>
      )}
    </div>
  );
}
