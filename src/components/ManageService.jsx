import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function ManageService() {
  const API_URL = `${import.meta.env.VITE_API_URL}/api/service`;
  const DOCTOR_URL = `${import.meta.env.VITE_API_URL}/api/doctor`;

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    require_doctor: false,
    allow_walkin: true,
    doctorIds: [],
    is_live: false, // 🔥 NEW FLAG
  });

  const [doctorsList, setDoctorsList] = useState([]);
  const [services, setServices] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ====================== FETCH SERVICES & DOCTORS ======================
  const fetchServices = async () => {
    try {
      const { data: serviceData } = await axios.get(API_URL);
      setServices(serviceData);

      const { data: doctorRes } = await axios.get(DOCTOR_URL);
      if (Array.isArray(doctorRes)) {
        setDoctorsList(doctorRes);
      } else if (doctorRes.success && Array.isArray(doctorRes.data)) {
        setDoctorsList(doctorRes.data);
      } else {
        console.error("Response doctor tidak valid:", doctorRes);
        setDoctorsList([]);
      }
    } catch (err) {
      console.error("Gagal fetch services/doctor:", err);
      setDoctorsList([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ====================== HANDLE FORM ======================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    });
  };

  const toggleDoctor = (id) => {
    setForm((prev) => {
      const exists = prev.doctorIds.includes(id);
      if (exists) return { ...prev, doctorIds: prev.doctorIds.filter((d) => d !== id) };
      return { ...prev, doctorIds: [...prev.doctorIds, id] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { data } = await axios.put(`${API_URL}/${form.id}`, form);
        setServices((prev) => prev.map((s) => (s.id === data.id ? data : s)));
        setIsEditing(false);
      } else {
        const { data } = await axios.post(API_URL, form);
        setServices((prev) => [...prev, data]);
      }
      resetForm();
    } catch (err) {
      console.error("Gagal submit service:", err);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      description: "",
      duration_minutes: "",
      price: "",
      require_doctor: false,
      allow_walkin: true,
      doctorIds: [],
      is_live: false, // reset
    });
    setIsEditing(false);
  };

  // ====================== EDIT ======================
  const handleEdit = (service) => {
    setForm({
      id: service.id,
      name: service.name || "",
      description: service.description || "",
      duration_minutes: service.duration_minutes || "",
      price: service.price || "",
      require_doctor: service.require_doctor || false,
      allow_walkin: service.allow_walkin,
      doctorIds: service.doctorIds || [],
      is_live: service.is_live || false, // load flag
    });
    setIsEditing(true);
  };

  // ====================== DELETE ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus layanan ini?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Gagal hapus service:", err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 flex flex-col items-center py-10">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl border border-blue-100 mb-10"
      >
        <h2 className="text-xl font-semibold text-blue-700 mb-6">
          {isEditing ? "Edit Layanan" : "Tambah Layanan Baru"}
        </h2>

        <div className="grid grid-cols-1 gap-5">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Layanan"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi Layanan"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="duration_minutes"
            value={form.duration_minutes}
            onChange={handleChange}
            placeholder="Durasi (menit)"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Harga"
            className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          {/* NEW FIELD */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_live"
              checked={form.is_live}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Layanan Video Call (Live Session)
          </label>

          {form.require_doctor && (
            <button
              type="button"
              onClick={() => setShowDoctorModal(true)}
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Pilih Dokter
            </button>
          )}

          {form.doctorIds.length > 0 && (
            <p className="text-sm text-blue-700 mt-1">
              Dokter dipilih: {form.doctorIds.join(", ")}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {isEditing ? "Update Layanan" : "Simpan Layanan"}
        </button>
      </form>

      {/* Services List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md border border-blue-100 flex flex-col justify-between"
          >
            <h3 className="font-semibold text-blue-700">{s.name}</h3>
            <p className="text-sm text-gray-600">{s.description}</p>
            <p className="text-sm text-gray-500">
              Durasi: {s.duration_minutes} menit
            </p>
            <p className="text-sm text-gray-500">Harga: Rp{s.price}</p>

            <p className="text-sm text-green-600">
              {s.require_doctor ? "Butuh Dokter" : "Tidak Butuh Dokter"}
            </p>

            <p className="text-sm text-purple-600">
              {s.is_live ? "Video Call" : "Layanan Normal"}
            </p>

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => handleEdit(s)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      {isEditing && (
        <button
          onClick={resetForm}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex justify-center items-center text-2xl hover:bg-blue-700 transition"
        >
          <FaPlus />
        </button>
      )}

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-transparent bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-5 relative">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Pilih Dokter
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
              {doctorsList.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-blue-200 rounded-lg p-3 flex gap-3 items-center"
                >
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">{doc.name}</h4>
                    <p className="text-sm text-blue-700">{doc.specialization}</p>
                    <p
                      className={`text-xs mt-1 ${
                        doc.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {doc.isActive ? "Aktif" : "Tidak Aktif"}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.doctorIds.includes(doc.id)}
                    onChange={() => toggleDoctor(doc.id)}
                    className="h-5 w-5"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowDoctorModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Tutup
              </button>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
