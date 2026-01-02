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
  Pill
} from "lucide-react";

// ================================
// CONFIG
// ================================
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ================================
// MAIN COMPONENT
// ================================
export default function ManagePrescription() {
  const [requests, setRequests] = useState([]);
  const [usersGrouped, setUsersGrouped] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
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

      // group approved access per user
      const map = {};
      reqs.forEach((r) => {
        const uid = r.user?.id;
        if (!uid) return;

        if (!map[uid]) {
          map[uid] = {
            user: r.user,
            accesses: [],
          };
        }

        if (r.status === "approved") {
          map[uid].accesses.push(r);
        }
      });

      setUsersGrouped(Object.values(map));
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function approveRequest(id) {
    if (!confirm("Setujui request ini?")) return;

    try {
      await axios.put(
        `${API_URL}/api/prescription/admin/prescription/${id}/approve`,
        {},
        { headers: getAuthHeader() }
      );
      fetchAll();
    } catch {
      alert("Gagal menyetujui request");
    }
  }

  async function rejectRequest(id) {
    if (!confirm("Tolak request ini?")) return;

    try {
      await axios.put(
        `${API_URL}/api/prescription/admin/prescription/${id}/reject`,
        {},
        { headers: getAuthHeader() }
      );
      fetchAll();
    } catch {
      alert("Gagal menolak request");
    }
  }

  async function removeAccess(id) {
    if (!confirm("Hapus akses obat ini?")) return;

    try {
      await axios.delete(
        `${API_URL}/api/prescription/admin/prescription/${id}`,
        { headers: getAuthHeader() }
      );
      fetchAll();
    } catch {
      alert("Gagal menghapus akses");
    }
  }

  async function grantAccess(userId, productId) {
    if (!productId) return;

    try {
      await axios.post(
        `${API_URL}/api/prescription/admin/prescription/grant`,
        {
          user_id: userId,
          product_id: productId,
        },
        { headers: getAuthHeader() }
      );
      fetchAll();
    } catch {
      alert("Gagal menambah akses");
    }
  }

  const filteredUsers = usersGrouped.filter(g => {
    const matchSearch = g.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       g.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const filteredRequests = requests.filter(r => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const stats = {
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Manajemen Resep
              </h1>
              <p className="text-sm text-gray-600 mt-1 ml-0 sm:ml-13">
                Kelola request & izin akses obat resep
              </p>
            </div>
            <button
              onClick={fetchAll}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border-2 border-yellow-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-red-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* LEFT PANEL - Users List */}
          <section className="lg:col-span-4 bg-white rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
              <div className="flex items-center gap-3 text-white">
                <Users className="w-6 h-6" />
                <h2 className="font-bold text-lg">Daftar Pengguna</h2>
              </div>
            </div>

            <div className="p-4">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all bg-blue-50/30"
                />
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                  <p className="text-gray-500">Memuat data...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((g) => (
                    <div
                      key={g.user.id}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedUser?.user.id === g.user.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                      onClick={() => setSelectedUser(g)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {g.user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {g.user.email}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {g.accesses.length} Akses
                            </span>
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      </div>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected User Detail */}
            {selectedUser && (
              <div className="border-t-2 border-blue-100 bg-blue-50/30 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-bold text-gray-900">
                      {selectedUser.user.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedUser.user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {selectedUser.accesses.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded-xl border-2 border-dashed border-blue-200">
                      <Pill className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Belum ada akses obat</p>
                    </div>
                  ) : (
                    selectedUser.accesses.map((a) => (
                      <div
                        key={a.id}
                        className="p-3 bg-white rounded-xl border-2 border-blue-100 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Pill className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {a.product?.name}
                          </span>
                        </div>
                        <button
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          onClick={() => removeAccess(a.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <ManualGrantForm
                  userAccesses={selectedUser.accesses}
                  onGrant={(pid) => grantAccess(selectedUser.user.id, pid)}
                />
              </div>
            )}
          </section>

          {/* RIGHT PANEL - Requests */}
          <section className="lg:col-span-8 bg-white rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 text-white">
                  <FileText className="w-6 h-6" />
                  <h2 className="font-bold text-lg">Request Resep</h2>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "Semua" },
                    { value: "pending", label: "Pending" },
                    { value: "approved", label: "Approved" },
                    { value: "rejected", label: "Rejected" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === filter.value
                          ? 'bg-white text-blue-600'
                          : 'bg-blue-500 text-white hover:bg-blue-400'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Tidak ada request ditemukan</p>
                  </div>
                ) : (
                  filteredRequests.map((r) => (
                    <div
                      key={r.id}
                      className="border-2 border-blue-100 rounded-2xl p-4 hover:border-blue-300 transition-all bg-white"
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="relative group flex-shrink-0">
                          <img
                            src={r.prescription_image}
                            className="w-full sm:w-28 h-28 object-cover rounded-xl border-2 border-blue-200 cursor-pointer"
                            onClick={() => setPreviewImage(r.prescription_image)}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {r.product?.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {r.user?.name}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {r.user?.email}
                              </span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {r.status === "pending" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold">
                                <Clock className="w-4 h-4" />
                                Menunggu Persetujuan
                              </span>
                            )}
                            {r.status === "approved" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                Disetujui
                              </span>
                            )}
                            {r.status === "rejected" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                                <XCircle className="w-4 h-4" />
                                Ditolak
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {r.status === "pending" && (
                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                              <button
                                onClick={() => approveRequest(r.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md"
                              >
                                <Check className="w-5 h-5" />
                                Setujui
                              </button>
                              <button
                                onClick={() => rejectRequest(r.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all"
                              >
                                <X className="w-5 h-5" />
                                Tolak
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
            <img
              src={previewImage}
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ================================
// MANUAL GRANT FORM
// ================================
function ManualGrantForm({ onGrant, userAccesses }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  const accessIds = userAccesses.map(
    (a) => String(a.product_id || a.product?.id)
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/api/medicine/products`)
      .then((res) => setProducts(res.data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!productId) {
      setHasAccess(false);
    } else {
      setHasAccess(accessIds.includes(productId));
    }
  }, [productId, accessIds]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Tambah Akses Manual
      </label>
      
      <select
        className="w-full border-2 border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white transition-all"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">Pilih obat resep..</option>
        {products.filter(p => p.is_prescription_required).map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {hasAccess && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            User sudah memiliki akses ke obat ini
          </p>
        </div>
      )}

      <button
        disabled={!productId || hasAccess}
        onClick={() => {
          onGrant(productId);
          setProductId("");
        }}
        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          hasAccess || !productId
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md"
        }`}
      >
        <Plus className="w-5 h-5" />
        Tambah Akses Obat
      </button>
    </div>
  );
}