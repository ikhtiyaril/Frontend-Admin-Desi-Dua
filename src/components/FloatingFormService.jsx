import React, { useState, useEffect } from "react";
import axios from 'axios'

export default function FloatingFormService({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    require_doctor: false,
    allow_walkin: true,
    is_live: false,
    doctorIds:[]
  });

  // Kalau ada initialData (edit), set form
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

// Tambahkan state dokter
const [doctorsList, setDoctorsList] = useState([]);
const [showDoctorModal, setShowDoctorModal] = useState(false);

// Ambil dokter pas form mount
useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_URL}/api/doctor`).then((res) => {
    if (Array.isArray(res.data)) setDoctorsList(res.data);
    else if (res.data.success && Array.isArray(res.data.data))
      setDoctorsList(res.data.data);
  });
}, []);

// Toggle dokter ke form
const toggleDoctor = (id) => {
  setForm((prev) => {
    const exists = prev.doctorIds?.includes(id);
    if (exists) return { ...prev, doctorIds: prev.doctorIds.filter(d => d !== id) };
    return { ...prev, doctorIds: [...(prev.doctorIds || []), id] };
  });
};


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed  inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center pt-20 z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border  border-blue-200 "
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-5">
          {initialData ? "Edit Layanan" : "Tambah Layanan"}
        </h3>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Layanan"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi Layanan"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            name="duration_minutes"
            value={form.duration_minutes}
            onChange={handleChange}
            placeholder="Durasi (menit)"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Harga"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="require_doctor"
              checked={form.require_doctor}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Butuh Dokter
          </label>
{form.require_doctor && (
  <>
    <button
      type="button"
      onClick={() => setShowDoctorModal(true)}
      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-2"
    >
      Pilih Dokter
    </button>

    {form.doctorIds?.length > 0 && (
      <p className="text-sm text-blue-700 mt-1">
        Dokter dipilih: {form.doctorIds.join(", ")}
      </p>
    )}
  </>
)}

{showDoctorModal && (
  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50 p-4">
    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 relative">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Pilih Dokter</h3>
      <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
        {doctorsList.map(doc => (
          <label key={doc.id} className="flex items-center gap-3 border p-2 rounded-lg">
            <input
              type="checkbox"
              checked={form.doctorIds?.includes(doc.id)}
              onChange={() => toggleDoctor(doc.id)}
              className="h-5 w-5"
            />
            <div>
              <p className="font-semibold text-blue-900">{doc.name}</p>
              <p className="text-sm text-gray-600">{doc.specialization}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={() => setShowDoctorModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
          Tutup
        </button>
        <button onClick={() => setShowDoctorModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Selesai
        </button>
      </div>
    </div>
  </div>
)}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="allow_walkin"
              checked={form.allow_walkin}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Bisa Walk-in
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_live"
              checked={form.is_live}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Video Call / Live Session
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Tutup
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {initialData ? "Update" : "Simpan"}
          </button>
        </div>
      </form>
      {/* Tombol Pilih Dokter */}


    </div>
  );
}
