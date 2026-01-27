import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  RefreshCw, 
  Users, 
  FileText, 
  Check, 
  X, 
  Trash2, 
  Plus, 
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Pill,
  Download // Tambahan untuk fitur fungsional
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function ManagePrescription() {
  const [requests, setRequests] = useState([]);
  const [usersGrouped, setUsersGrouped] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // State Utama untuk Modal Floating
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_URL}/api/prescription/admin/prescription/requests`,
        { headers: getAuthHeader() }
      );
      const reqs = res.data.requests || [];
      setRequests(reqs);

      const map = {};
      reqs.forEach((r) => {
        const uid = r.user?.id;
        if (!uid) return;
        if (!map[uid]) {
          map[uid] = { user: r.user, accesses: [] };
        }
        if (r.status === "approved") {
          map[uid].accesses.push(r);
        }
      });
      setUsersGrouped(Object.values(map));
    } catch (err) {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  // --- Logic Approve, Reject, Remove, Grant tetap sama (Omitted for brevity) ---
  async function approveRequest(id) { if (!confirm("Setujui?")) return; try { await axios.put(`${API_URL}/api/prescription/admin/prescription/${id}/approve`, {}, { headers: getAuthHeader() }); fetchAll(); } catch { alert("Gagal"); } }
  async function rejectRequest(id) { if (!confirm("Tolak?")) return; try { await axios.put(`${API_URL}/api/prescription/admin/prescription/${id}/reject`, {}, { headers: getAuthHeader() }); fetchAll(); } catch { alert("Gagal"); } }
  async function removeAccess(id) { if (!confirm("Hapus?")) return; try { await axios.delete(`${API_URL}/api/prescription/admin/prescription/${id}`, { headers: getAuthHeader() }); fetchAll(); } catch { alert("Gagal"); } }
  async function grantAccess(userId, productId) { try { await axios.post(`${API_URL}/api/prescription/admin/prescription/grant`, { user_id: userId, product_id: productId }, { headers: getAuthHeader() }); fetchAll(); } catch { alert("Gagal"); } }

  const filteredUsers = usersGrouped.filter(g => 
    g.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter(r => filterStatus === "all" ? true : r.status === filterStatus);

  const stats = {
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header & Stats (Tetap sama seperti kode asli) */}
        <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white"><FileText /></div>
                    Manajemen Resep
                </h1>
                <button onClick={fetchAll} className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-blue-200">
                    <RefreshCw className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-400">
                    <p className="text-sm text-slate-500">Approved</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.approved}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-400">
                    <p className="text-sm text-slate-500">Rejected</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.rejected}</p>
                </div>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANEL - Users List */}
          <section className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[700px]">
            <div className="p-5 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
                <Users size={20} className="text-blue-600" /> Daftar Pengguna
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <input
                type="text"
                placeholder="Cari user..."
                className="w-full px-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="space-y-2">
                {filteredUsers.map((g) => (
                  <div
                    key={g.user.id}
                    className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedUser?.user.id === g.user.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedUser(g)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate text-sm">{g.user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{g.user.email}</p>
                      </div>
                      
                      {/* FITUR BARU: Tombol Mata untuk Preview Gambar Terakhir User */}
                      <div className="flex items-center gap-1">
                        {g.accesses.length > 0 && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation(); // Agar tidak mentrigger select user
                                    setPreviewImage(g.accesses[0].prescription_image);
                                }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="Lihat Resep Terakhir"
                            >
                                <Eye size={18} />
                            </button>
                        )}
                        <span className="text-[10px] bg-slate-200 px-2 py-1 rounded-md font-bold">{g.accesses.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedUser && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
                <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-bold text-slate-500 uppercase">Akses Aktif</p>
                    <button onClick={() => setSelectedUser(null)}><X size={14}/></button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                  {selectedUser.accesses.map(a => (
                    <div key={a.id} className="flex justify-between items-center bg-white p-2 rounded-lg text-xs border border-slate-200">
                      <span className="truncate flex-1 font-medium">{a.product?.name}</span>
                      <button onClick={() => removeAccess(a.id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
                <ManualGrantForm 
                    userAccesses={selectedUser.accesses} 
                    onGrant={(pid) => grantAccess(selectedUser.user.id, pid)} 
                />
              </div>
            )}
          </section>

          {/* RIGHT PANEL - Requests */}
          <section className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(s => (
                        <button 
                            key={s} 
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Preview Gambar Kecil */}
                    <div 
                        className="relative w-24 h-24 rounded-xl overflow-hidden cursor-zoom-in group border border-slate-100 shadow-inner flex-shrink-0"
                        onClick={() => setPreviewImage(r.prescription_image)}
                    >
                      <img src={r.prescription_image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="text-white" size={20} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-bold text-slate-800 truncate">{r.product?.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{r.user?.name}</p>
                      <div className="pt-2">
                        {r.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => approveRequest(r.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-xs font-bold transition-colors">Terima</button>
                            <button onClick={() => rejectRequest(r.id)} className="flex-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 py-1.5 rounded-lg text-xs font-bold transition-colors">Tolak</button>
                          </div>
                        ) : (
                          <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {r.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL FLOATING PREVIEW - Enhanced UI */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setPreviewImage(null)}
          />
          
          {/* Image Container */}
          <div className="relative z-10 max-w-5xl w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
            {/* Header Modal Floating */}
            <div className="absolute -top-14 right-0 flex gap-3">
               <a 
                href={previewImage} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/20"
               >
                 <Download size={20} />
               </a>
               <button 
                onClick={() => setPreviewImage(null)}
                className="p-3 bg-white text-slate-900 rounded-full shadow-xl hover:bg-red-500 hover:text-white transition-all"
               >
                 <X size={20} />
               </button>
            </div>

            <img
              src={previewImage}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white/10 bg-black/20"
              alt="Prescription Preview"
            />
            
            <p className="mt-4 text-white/60 text-sm font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
              Klik di luar gambar untuk menutup
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ManualGrantForm Component (Logic tetap sama, sedikit UI polish)
function ManualGrantForm({ onGrant, userAccesses }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const accessIds = userAccesses.map(a => String(a.product_id || a.product?.id));

  useEffect(() => {
    axios.get(`${API_URL}/api/medicine/products`)
      .then((res) => setProducts(res.data.data || []))
      .catch(console.error);
  }, []);

  const hasAccess = accessIds.includes(productId);

  return (
    <div className="space-y-2">
      <select
        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">Tambah Akses Manual...</option>
        {products.filter(p => p.is_prescription_required).map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <button
        disabled={!productId || hasAccess}
        onClick={() => { onGrant(productId); setProductId(""); }}
        className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold disabled:bg-slate-300 transition-colors shadow-sm"
      >
        {hasAccess ? "Sudah Memiliki Akses" : "Beri Izin Akses"}
      </button>
    </div>
  );
}