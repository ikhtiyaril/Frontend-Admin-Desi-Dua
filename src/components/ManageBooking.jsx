import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa";

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
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
    } catch (err) {
      console.error("Gagal submit booking:", err);
    }
  };

  // Edit booking
  const handleEdit = (b) => {
    setForm({ ...b });
    setIsEditing(true);
    setShowForm(true);
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status) => {
    return status === "paid" 
      ? "bg-green-100 text-green-800" 
      : "bg-orange-100 text-orange-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Manajemen Booking
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-2">Kelola semua jadwal booking pasien</p>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Kode Booking</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Pasien</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Layanan</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Dokter</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Tanggal</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Waktu</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Pembayaran</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Metode</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Catatan</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-4 font-semibold text-blue-700 whitespace-nowrap">
                      #{b.booking_code}
                    </td>
                    <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{b.patient_id}</td>
                    <td className="px-4 py-4 text-gray-900 whitespace-nowrap">{b.service_id}</td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {b.doctor_id || <span className="text-gray-400 italic">Belum ditentukan</span>}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">{b.date}</td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                      {b.time_start} - {b.time_end}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadge(b.payment_status)}`}>
                        {b.payment_status === "paid" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {b.payment_method || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-4 text-gray-600 text-sm max-w-xs truncate">
                      {b.notes || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setIsEditing(false);
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
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex justify-center items-center text-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 z-50"
      >
        <FaPlus />
      </button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? "Edit Booking" : "Tambah Booking Baru"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pasien *</label>
                  <select
                    name="patient_id"
                    value={form.patient_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Pilih Pasien</option>
                    {dummyPatients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layanan *</label>
                  <select
                    name="service_id"
                    value={form.service_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Pilih Layanan</option>
                    {dummyServices.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dokter</label>
                  <select
                    name="doctor_id"
                    value={form.doctor_id || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Dokter (Opsional)</option>
                    {dummyDoctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal *</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jam Mulai *</label>
                    <input
                      type="time"
                      name="time_start"
                      value={form.time_start}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Jam Selesai *</label>
                    <input
                      type="time"
                      name="time_end"
                      value={form.time_end}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Tambahkan catatan khusus (opsional)"
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran</label>
                  <select
                    name="payment_status"
                    value={form.payment_status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="unpaid">Belum Dibayar</option>
                    <option value="paid">Sudah Dibayar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                  <input
                    type="text"
                    name="payment_method"
                    value={form.payment_method || ""}
                    onChange={handleChange}
                    placeholder="Contoh: Cash, Transfer, Kartu Kredit"
                    className="w-full px-4 py-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  {isEditing ? "Update Booking" : "Simpan Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}