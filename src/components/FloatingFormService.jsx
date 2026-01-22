import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload, FileText, Clock, DollarSign, Users, Video, CheckCircle2 } from "lucide-react";

export default function FloatingFormService({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration_minutes: "",
    price: "",
    require_doctor: false,
    allow_walkin: true,
    is_live: false,
    doctorIds: [],
    article_id: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // =========================
  // SET INITIAL DATA (EDIT)
  // =========================
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        doctorIds: initialData.doctorIds || [],
        article_id: initialData.article?.id || null,
      });
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  // =========================
  // DOCTORS
  // =========================
  const [doctorsList, setDoctorsList] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/doctor`).then((res) => {
      if (Array.isArray(res.data)) setDoctorsList(res.data);
      else if (res.data?.data) setDoctorsList(res.data.data);
    });
  }, []);

  const toggleDoctor = (id) => {
    setForm((prev) => ({
      ...prev,
      doctorIds: prev.doctorIds.includes(id)
        ? prev.doctorIds.filter((d) => d !== id)
        : [...prev.doctorIds, id],
    }));
  };

  // =========================
  // ARTICLES
  // =========================
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/posts`).then((res) => {
      if (Array.isArray(res.data)) setArticles(res.data);
      else if (res.data?.data) setArticles(res.data.data);
    });
  }, []);

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("duration_minutes", form.duration_minutes);
    fd.append("price", form.price);
    fd.append("require_doctor", form.require_doctor);
    fd.append("allow_walkin", form.allow_walkin);
    fd.append("is_live", form.is_live);

    if (form.article_id) {
      fd.append("article_id", form.article_id);
    }

    if (form.require_doctor) {
      fd.append("doctorIds", JSON.stringify(form.doctorIds));
    }

    if (imageFile) {
      fd.append("image", imageFile);
    }

    onSubmit(fd);
    onClose();
  };

  const selectedDoctors = doctorsList.filter(d => form.doctorIds.includes(d.id));

  // =========================
  // RENDER
  // =========================
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/20 to-blue-900/20 backdrop-blur-md flex justify-center items-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl my-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 px-6 sm:px-8 py-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900">
                {initialData ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h3>
              <p className="text-sm text-blue-600/70 mt-1">
                Lengkapi informasi layanan kesehatan
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-blue-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-blue-900" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-5">
              {/* Image Upload with Preview */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Upload className="w-4 h-4" />
                  Gambar Layanan
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {imagePreview && (
                    <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden border-2 border-blue-200 bg-blue-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center">
                      <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-sm text-blue-900 font-medium">Upload Gambar</p>
                      <p className="text-xs text-blue-600/60 mt-1">PNG, JPG hingga 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <FileText className="w-4 h-4" />
                  Nama Layanan
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Konsultasi Umum"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-blue-400/50"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-900">
                  Deskripsi Layanan
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Jelaskan detail layanan..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-blue-400/50"
                />
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Clock className="w-4 h-4" />
                    Durasi (menit)
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={form.duration_minutes}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-blue-400/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <DollarSign className="w-4 h-4" />
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="100000"
                    className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-blue-400/50"
                    required
                  />
                </div>
              </div>

              {/* Article Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-blue-900">
                  Artikel Terkait
                </label>
                <select
                  value={form.article_id || ""}
                  onChange={(e) =>
                    setForm({ ...form, article_id: e.target.value || null })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">— Tidak dikaitkan —</option>
                  {articles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div className="space-y-3 bg-blue-50/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-100">
                <p className="text-sm font-semibold text-blue-900 mb-3">Pengaturan Layanan</p>
                
                {/* Require Doctor */}
                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 cursor-pointer transition-all group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="require_doctor"
                      checked={form.require_doctor}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-blue-200 rounded-full peer-checked:bg-blue-600 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-medium text-blue-900">Membutuhkan Dokter</span>
                  </div>
                </label>

                {/* Doctor Selection */}
                {form.require_doctor && (
                  <div className="ml-14 space-y-2 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => setShowDoctorModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Pilih Dokter ({form.doctorIds.length})
                    </button>
                    {selectedDoctors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedDoctors.map(doc => (
                          <span key={doc.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {doc.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Allow Walk-in */}
                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 cursor-pointer transition-all group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="allow_walkin"
                      checked={form.allow_walkin}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-blue-200 rounded-full peer-checked:bg-blue-600 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <span className="text-sm font-medium text-blue-900">Tersedia Walk-in</span>
                </label>

                {/* Is Live */}
                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 cursor-pointer transition-all group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="is_live"
                      checked={form.is_live}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="w-11 h-6 bg-blue-200 rounded-full peer-checked:bg-blue-600 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-700" />
                    <span className="text-sm font-medium text-blue-900">Video Call / Live</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gradient-to-r from-blue-50 to-white border-t border-blue-100 px-6 sm:px-8 py-5 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-blue-300 text-blue-700 font-semibold hover:bg-blue-50 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            >
              {initialData ? "Update Layanan" : "Simpan Layanan"}
            </button>
          </div>
        </form>
      </div>

      {/* Doctor Selection Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 px-6 py-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Pilih Dokter
              </h4>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-blue-900" />
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto space-y-2">
              {doctorsList.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={form.doctorIds.includes(doc.id)}
                    onChange={() => toggleDoctor(doc.id)}
                    className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-blue-900 group-hover:text-blue-700">
                    {doc.name}
                  </span>
                  {form.doctorIds.includes(doc.id) && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />
                  )}
                </label>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-white border-t border-blue-100 px-6 py-4">
              <button
                onClick={() => setShowDoctorModal(false)}
                className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all"
              >
                Selesai ({form.doctorIds.length} dipilih)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}