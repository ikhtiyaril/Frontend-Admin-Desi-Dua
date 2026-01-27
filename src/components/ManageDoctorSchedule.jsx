import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaFilter,
  FaCoffee,
  FaTimes
} from "react-icons/fa";

export default function ManageDoctorSchedule() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [form, setForm] = useState({
    id: null,
    doctor_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    break_start: "",
    break_end: ""
  });

  const days = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
  ];

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor`);
      setDoctors(res.data.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor-schedule`);
      setSchedules(res.data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor_id || !form.day_of_week || !form.start_time || !form.end_time) {
      alert("Harap lengkapi bidang yang wajib diisi");
      return;
    }
const token = localStorage.getItem('token')
    try {
      if (form.id) {
        await axios.put(`${API_URL}/api/doctor-schedule/${form.id}`, form,{
  headers: { Authorization: `Bearer ${token}` }
});
      } else {
        await axios.post(`${API_URL}/api/doctor-schedule`, form);
      }
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      doctor_id: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      break_start: "",
      break_end: ""
    });
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      doctor_id: item.doctor_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      break_start: item.break_start || "",
      break_end: item.break_end || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus jadwal ini?")) return;
    try {
      await axios.delete(`${API_URL}/api/doctor-schedule/${id}`);
      fetchSchedules();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center gap-3">
            <FaCalendarAlt className="text-blue-600 shrink-0" /> 
            <span>Atur Jadwal Dokter</span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">Kelola jam kerja staf medis Anda.</p>
        </div>
        
        {/* FILTER BOX */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-blue-100 flex items-center gap-3 px-4 w-full sm:w-auto">
          <FaFilter className="text-blue-400 shrink-0" />
          <select
            className="bg-transparent focus:outline-none text-sm font-medium text-slate-600 cursor-pointer w-full shadow-none border-none"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Semua Dokter</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* FORM SECTION */}
        <div className="lg:col-span-4 order-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-8 transition-all">
            <div className={`p-4 flex items-center justify-between ${form.id ? 'bg-amber-500' : 'bg-blue-600'}`}>
              <h2 className="text-white font-semibold flex items-center gap-2">
                {form.id ? <FaEdit /> : <FaPlus />} 
                {form.id ? "Mode Edit Jadwal" : "Tambah Jadwal Baru"}
              </h2>
              {form.id && (
                <button onClick={resetForm} className="text-white/80 hover:text-white">
                  <FaTimes />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Nama Dokter</label>
                <div className="relative">
                   <FaUserMd className="absolute left-3 top-3.5 text-slate-400" />
                   <select
                    name="doctor_id"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                    value={form.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Dokter</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Hari Kerja</label>
                <select
                  name="day_of_week"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={form.day_of_week}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Hari</option>
                  {days.map((d, index) => (
                    <option key={index} value={index}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Jam Mulai</label>
                  <input
                    type="time"
                    name="start_time"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Jam Selesai</label>
                  <input
                    type="time"
                    name="end_time"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase mb-3 flex items-center gap-2">
                  <FaCoffee className="text-sm" /> Waktu Istirahat (Opsional)
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    name="break_start"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                    value={form.break_start}
                    onChange={handleChange}
                  />
                  <input
                    type="time"
                    name="break_end"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                    value={form.break_end}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-4 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  form.id ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {form.id ? <FaEdit /> : <FaPlus />} 
                {form.id ? "Perbarui Jadwal" : "Simpan Jadwal"}
              </button>
            </form>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="lg:col-span-8 order-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dokter</th>
                    <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hari</th>
                    <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Waktu</th>
                    <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Istirahat</th>
                    <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {schedules
                    .filter((s) => selectedDoctor ? s.doctor_id == selectedDoctor : true)
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-700">{item.Doctor?.name}</div>
                          <div className="text-[11px] text-blue-500 font-medium">{item.Doctor?.specialization || 'Umum'}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-white border border-blue-100 text-blue-600 text-xs px-2.5 py-1 rounded-lg font-bold">
                            {days[item.day_of_week]}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <FaClock className="text-slate-300 shrink-0" />
                            {item.start_time.substring(0,5)} - {item.end_time.substring(0,5)}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {item.break_start && item.break_end ? (
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                              <FaCoffee className="text-[10px]" />
                              {item.break_start.substring(0,5)} - {item.break_end.substring(0,5)}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          {/* Aksi: Selalu muncul di mobile, Hover di desktop */}
                          <div className="flex justify-end gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200">
                            <button
                              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                              onClick={() => handleDelete(item.id)}
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {schedules.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="text-slate-300 text-2xl" />
                </div>
                <h3 className="text-slate-600 font-semibold">Tidak Ada Data</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                  Jadwal dokter belum tersedia atau tidak ditemukan untuk filter ini.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}