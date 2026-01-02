import { useEffect, useState } from "react";
import axios from "axios";
import { Save, Plus, X, Upload, Clock, Mail, Phone, MapPin, Image, FileText, Info } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageGeneral() {
  const [profile, setProfile] = useState(null);
  const [draftBanners, setDraftBanners] = useState([]);
  const [draftServices, setDraftServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get(`${API_URL}/api/clinic-profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setProfile(res.data);
    setDraftBanners(res.data.bannerCards || []);
    setDraftServices(res.data.serviceCards || []);
    setLoading(false);
  };

  const handleField = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const addBanner = () =>
    setDraftBanners([
      ...draftBanners,
      { title: "", description: "", image: "" },
    ]);

  const updateBanner = (i, field, value) => {
    const updated = [...draftBanners];
    updated[i][field] = value;
    setDraftBanners(updated);
  };

  const removeBanner = (i) => {
    setDraftBanners(draftBanners.filter((_, idx) => idx !== i));
  };

  const bannerImage = (i, file) => {
    const updated = [...draftBanners];
    updated[i]._file = file;
    setDraftBanners(updated);
  };

  const addService = () =>
    setDraftServices([
      ...draftServices,
      { title: "", description: "", image: "" },
    ]);

  const updateService = (i, field, value) => {
    const updated = [...draftServices];
    updated[i][field] = value;
    setDraftServices(updated);
  };

  const removeService = (i) => {
    setDraftServices(draftServices.filter((_, idx) => idx !== i));
  };

  const serviceImage = (i, file) => {
    const updated = [...draftServices];
    updated[i]._file = file;
    setDraftServices(updated);
  };

  const handleSave = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.append("shortDescription", profile.shortDescription);
    formData.append("longDescription", profile.longDescription);
    formData.append("backstory", profile.backstory || "");
    formData.append("contact", JSON.stringify(profile.contact));
    formData.append("operationalHours", JSON.stringify(profile.operationalHours));
    formData.append("bannerCards", JSON.stringify(draftBanners.map(({ _file, ...rest }) => rest)));
    formData.append("serviceCards", JSON.stringify(draftServices.map(({ _file, ...rest }) => rest)));

    draftBanners.forEach((item) => {
      if (item._file) formData.append("bannerImages", item._file);
    });

    draftServices.forEach((item) => {
      if (item._file) formData.append("serviceImages", item._file);
    });

    await axios.put(`${API_URL}/api/clinic-profile`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Settings berhasil disimpan");
    setSaving(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan Umum Website</h1>
              <p className="text-gray-500 mt-1">Kelola informasi dan konten website klinik Anda</p>
            </div>
            <button
              disabled={saving}
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <Save className="w-5 h-5" />
              {saving ? "Menyimpan..." : "Simpan Semua"}
            </button>
          </div>
        </div>

        {/* Description Section */}
        <Section icon={Info} title="Deskripsi Website">
          <div className="grid gap-6">
            <InputField
              label="Deskripsi Singkat"
              placeholder="Masukkan deskripsi singkat klinik..."
              value={profile.shortDescription}
              onChange={(e) => handleField("shortDescription", e.target.value)}
            />

            <TextareaField
              label="Deskripsi Lengkap"
              placeholder="Masukkan deskripsi lengkap tentang klinik..."
              value={profile.longDescription}
              onChange={(e) => handleField("longDescription", e.target.value)}
              rows={5}
            />

            <TextareaField
              label="Cerita Kami"
              placeholder="Ceritakan sejarah dan visi klinik..."
              value={profile.backstory || ""}
              onChange={(e) => handleField("backstory", e.target.value)}
              rows={4}
            />
          </div>
        </Section>

        {/* Operational Hours */}
        <Section icon={Clock} title="Jam Operasional">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(profile.operationalHours).map((day) => (
              <InputField
                key={day}
                label={day.charAt(0).toUpperCase() + day.slice(1)}
                value={profile.operationalHours[day]}
                onChange={(e) =>
                  handleField("operationalHours", {
                    ...profile.operationalHours,
                    [day]: e.target.value,
                  })
                }
                placeholder="contoh: 08:00 - 17:00"
              />
            ))}
          </div>
        </Section>

        {/* Contact Information */}
        <Section icon={Phone} title="Informasi Kontak">
          <div className="grid md:grid-cols-2 gap-6">
            <InputField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="email@klinik.com"
              value={profile.contact.email}
              onChange={(e) =>
                handleField("contact", {
                  ...profile.contact,
                  email: e.target.value,
                })
              }
            />

            <InputField
              label="Telepon"
              icon={Phone}
              type="tel"
              placeholder="+62 xxx xxxx xxxx"
              value={profile.contact.phone}
              onChange={(e) =>
                handleField("contact", {
                  ...profile.contact,
                  phone: e.target.value,
                })
              }
            />
          </div>

          <TextareaField
            label="Alamat"
            icon={MapPin}
            placeholder="Masukkan alamat lengkap klinik..."
            value={profile.contact.address}
            onChange={(e) =>
              handleField("contact", {
                ...profile.contact,
                address: e.target.value,
              })
            }
            rows={3}
          />
        </Section>

        {/* Banners Section */}
        <Section icon={Image} title="Banner Homepage">
          <div className="space-y-4">
            <button
              onClick={addBanner}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Banner
            </button>

            <div className="grid gap-4">
              {draftBanners.map((item, i) => (
                <CardEditor
                  key={i}
                  title={`Banner ${i + 1}`}
                  item={item}
                  onChange={(f, v) => updateBanner(i, f, v)}
                  onImage={(file) => bannerImage(i, file)}
                  onRemove={() => removeBanner(i)}
                />
              ))}

              {draftBanners.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada banner. Klik tombol di atas untuk menambah.</p>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Services Section */}
        <Section icon={FileText} title="Layanan Unggulan">
          <div className="space-y-4">
            <button
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Tambah Layanan
            </button>

            <div className="grid gap-4">
              {draftServices.map((item, i) => (
                <CardEditor
                  key={i}
                  title={`Layanan ${i + 1}`}
                  item={item}
                  onChange={(f, v) => updateService(i, f, v)}
                  onImage={(file) => serviceImage(i, file)}
                  onRemove={() => removeService(i)}
                />
              ))}

              {draftServices.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Belum ada layanan. Klik tombol di atas untuk menambah.</p>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Save Button Bottom */}
        <div className="flex justify-end pt-4">
          <button
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            <Save className="w-5 h-5" />
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* UI COMPONENTS */

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InputField({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          {...props}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            Icon ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
}

function TextareaField({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <textarea
          {...props}
          className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
            Icon ? "pl-11" : ""
          }`}
        />
      </div>
    </div>
  );
}

function CardEditor({ title, item, onChange, onImage, onRemove }) {
  const [preview, setPreview] = useState(item.image);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative border border-gray-200 rounded-xl p-6 bg-gray-50 space-y-4 hover:border-blue-300 transition-colors">
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="font-semibold text-gray-900 pr-10">{title}</h3>

      <div className="grid gap-4">
        <InputField
          label="Judul"
          placeholder="Masukkan judul..."
          value={item.title}
          onChange={(e) => onChange("title", e.target.value)}
        />

        <TextareaField
          label="Deskripsi"
          placeholder="Masukkan deskripsi..."
          value={item.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gambar</label>
          
          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="preview"
                className="h-32 w-full object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {preview ? "Ganti Gambar" : "Upload Gambar"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}