import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Edit, 
  Plus, 
  UserCog, 
  Info, 
  Clipboard,
  Package,
  User,
  Phone,
  Mail,
  Clock,
  Settings,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  ShoppingCart,
  Eye,
  AlertCircle,
  MapPin,
  PackageCheck,
  Loader2
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function ManageOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // states untuk floating detail
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // states untuk edit resi
  const [resiForm, setResiForm] = useState({ ekspedition: "", no_resi: "" });
  const [savingResi, setSavingResi] = useState(false);

  const token = localStorage.getItem("token");
  
  const statusConfig = {
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      label: "pending",
      icon: Clock,
    },
    processing: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "processing",
      icon: Settings,
    },
    delivered: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
      label: "delivered",
      icon: Truck,
    },
    completed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "completed",
      icon: CheckCircle,
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "cancelled",
      icon: XCircle,
    },
  };

  const paymentStatusConfig = {
    UNPAID: {
      label: "Belum Dibayar",
      classes: "text-amber-700 bg-amber-50 border-amber-200",
      icon: CreditCard,
    },
    PAID: {
      label: "Sudah Dibayar",
      classes: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: CheckCircle,
    },
    EXPIRED: {
      label: "Expired",
      classes: "text-gray-700 bg-gray-100 border-gray-200",
      icon: Clock,
    },
    FAILED: {
      label: "Gagal",
      classes: "text-red-700 bg-red-50 border-red-200",
      icon: XCircle,
    },
    REFUND: {
      label: "Refund",
      classes: "text-purple-700 bg-purple-50 border-purple-200",
      icon: AlertCircle,
    },
  };

  // ===== Fetch semua orders admin =====
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/orders/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(
        Array.isArray(res.data.orders)
          ? res.data.orders
          : res.data.orders
          ? [res.data.orders]
          : []
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data order.");
      setLoading(false);
    }
  };

  // ===== Update status order =====
  const updateStatus = async (id, status) => {
    try {
      // safety: cek payment_status dari state
      const ord = orders.find((o) => String(o.id) === String(id));
      if (ord && ord.payment_status !== "PAID") {
        return alert("Tidak bisa update status: pembayaran belum PAID.");
      }

      await axios.put(
        `${API}/api/orders/admin/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchOrders();
      alert(`Status order #${id} diubah menjadi ${status}`);
    } catch (err) {
      console.error(err);
      alert("Gagal update status.");
    }
  };

  // ===== Fetch single order detail (dipakai oleh floating drawer) =====
  const fetchOrderDetail = async (id) => {
    try {
      setDetailLoading(true);
      const res = await axios.get(`${API}/api/orders/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.order ?? res.data;
      setSelectedOrder(data);
      setShowDetail(true);
      setDetailLoading(false);
    } catch (err) {
      console.warn("Gagal fetch detail via API, mencoba pakai data lokal.", err);
      const local = orders.find((o) => String(o.id) === String(id));
      if (local) {
        setSelectedOrder(local);
        setShowDetail(true);
      } else {
        alert("Gagal mengambil detail order.");
      }
      setDetailLoading(false);
    }
  };

  // populate resiForm setiap kali selectedOrder berubah
  useEffect(() => {
    if (selectedOrder) {
      setResiForm({
        ekspedition: selectedOrder.ekspedition ?? "",
        no_resi: selectedOrder.no_resi ?? "",
      });
    } else {
      setResiForm({ ekspedition: "", no_resi: "" });
    }
  }, [selectedOrder]);

  // ===== Copy resi ke clipboard =====
  const copyResi = async (resi) => {
    try {
      if (!resi) return alert("Tidak ada nomor resi.");
      await navigator.clipboard.writeText(resi);
      alert("Nomor resi disalin.");
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Gagal menyalin resi.");
    }
  };

  // ===== Update resi (PUT) =====
  const updateResi = async () => {
    if (!selectedOrder) return alert("Tidak ada order terpilih.");

    if (selectedOrder.payment_status !== "PAID") {
      return alert("Tidak bisa input resi: pembayaran belum PAID.");
    }

    if (!resiForm.no_resi) return alert("Nomor resi wajib diisi.");

    try {
      setSavingResi(true);

      const payload = { no_resi: resiForm.no_resi, status: "delivered" };
      if (resiForm.ekspedition) payload.ekspedition = resiForm.ekspedition;

      await axios.put(
        `${API}/api/orders/admin/orders/${selectedOrder.id}/resi`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchOrders();
      alert("Resi berhasil diperbarui.");
      await fetchOrderDetail(selectedOrder.id);
      setSavingResi(false);
    } catch (err) {
      console.error("Gagal update resi:", err);
      alert("Gagal update resi.");
      setSavingResi(false);
    }
  };

  // ===== Close detail drawer =====
  const closeDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (value) => {
    try {
      if (value == null) return "Rp 0";
      const num = typeof value === "string" ? parseFloat(value) : Number(value);
      return `Rp ${new Intl.NumberFormat("id-ID").format(num)}`;
    } catch {
      return `Rp ${value}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-blue-600 rounded-xl shadow-md">
            <UserCog className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900">
              Manajemen Order
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
              Kelola data pesanan obat
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Package className="w-4 h-4 text-blue-600" />
            <p className="text-gray-600 text-xs font-medium">Total Pesanan</p>
          </div>
          <p className="text-gray-900 text-xl sm:text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <p className="text-gray-600 text-xs font-medium">Pending</p>
          </div>
          <p className="text-amber-600 text-xl sm:text-2xl font-bold">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <p className="text-gray-600 text-xs font-medium">Processing</p>
          </div>
          <p className="text-blue-600 text-xl sm:text-2xl font-bold">
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-gray-600 text-xs font-medium">Completed</p>
          </div>
          <p className="text-emerald-600 text-xl sm:text-2xl font-bold">
            {orders.filter((o) => o.status === "completed").length}
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-4 text-left text-sm font-semibold">Order ID</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Pelanggan</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Kontak</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Produk</th>
                <th className="px-4 py-4 text-right text-sm font-semibold">Total</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Update</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status] ?? statusConfig.pending;
                const payInfo = paymentStatusConfig[order.payment_status] ?? paymentStatusConfig.UNPAID;
                const isPaid = order.payment_status === "PAID";
                const StatusIcon = statusInfo.icon;
                const PayIcon = payInfo.icon;
                
                return (
                  <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-700">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-900 font-medium">{order.user?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{order.user?.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span>{order.user?.email || "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-sm">
                        {order.items && order.items.length > 0 ? (
                          order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-gray-700">
                              {item.product?.name || "Product"} × {item.quantity}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                        {order.items && order.items.length > 2 && (
                          <span className="text-xs text-blue-600 font-medium">+{order.items.length - 2} lainnya</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-gray-900">{formatCurrency(order.total_price)}</span>
                    </td>

                    <td className="px-4 py-4 text-center space-y-2">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${payInfo.classes}`}>
                          <PayIcon className="w-3.5 h-3.5" />
                          {payInfo.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <select
                        disabled={!isPaid}
                        className={`px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all bg-white font-medium
                          ${!isPaid ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400"}`}
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {!isPaid && (
                        <p className="text-xs text-red-500 mt-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Menunggu pembayaran
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                       

                        <button
                          onClick={() => fetchOrderDetail(order.id)}
                          title="Quick view"
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          <Info className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden max-w-7xl mx-auto space-y-3 sm:space-y-4">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status] ?? statusConfig.pending;
          const payInfo = paymentStatusConfig[order.payment_status] ?? paymentStatusConfig.UNPAID;
          const isPaid = order.payment_status === "PAID";
          const StatusIcon = statusInfo.icon;
          const PayIcon = payInfo.icon;

          return (
            <div key={order.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <p className="text-blue-700 font-bold text-base sm:text-lg">Order #{order.id}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${payInfo.classes}`}>
                      <PayIcon className="w-3.5 h-3.5" />
                      {payInfo.label}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="text-gray-500 text-xs mb-1">Total</p>
                  <p className="font-bold text-gray-900 text-base sm:text-lg">{formatCurrency(order.total_price)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50/50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 space-y-3 border border-blue-100">
                <div>
                  <p className="text-gray-600 text-xs mb-1 font-medium">Pelanggan</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    {order.user?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1 font-medium">Kontak</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-700 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {order.user?.phone || "-"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {order.user?.email || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs mb-1 font-medium">Produk</p>
                  <div className="space-y-1 text-sm">
                    {order.items && order.items.length > 0 ? (
                      <>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-gray-700">
                            {item.product?.name || "Product"} × {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-blue-600 font-medium">+{order.items.length - 2} produk lainnya</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="mb-3">
                <p className="text-gray-700 text-sm font-semibold mb-2">Update Status</p>
                <select
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all bg-white font-medium
                    ${!isPaid ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={!isPaid}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {!isPaid && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Tidak bisa update status sebelum pembayaran PAID
                  </p>
                )}
              </div>

              {/* Detail Buttons */}
              <div className="flex gap-2">
                
                <button
                  onClick={() => fetchOrderDetail(order.id)}
                  className="w-11 sm:w-12 h-11 sm:h-12 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  title="Quick view"
                >
                  <Info className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="max-w-7xl mx-auto bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
          <p className="text-gray-500">Pesanan akan muncul di sini saat pelanggan melakukan pemesanan</p>
        </div>
      )}

      {/* Floating Detail Drawer */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <div onClick={closeDetail} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* drawer */}
          <div className="relative ml-auto w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3 bg-white shadow-2xl h-full overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PackageCheck className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Detail Order #{selectedOrder?.id ?? ""}</h3>
                  </div>
                  <p className="text-sm text-gray-500">Informasi lengkap pesanan</p>
                </div>
                <button
                  onClick={closeDetail}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Tutup"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {detailLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Memuat detail...</p>
                </div>
              ) : (
                <>
                  {/* Customer Info */}
                  <div className="mb-5 bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-semibold text-gray-700">Informasi Pelanggan</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{selectedOrder?.user?.name ?? "-"}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {selectedOrder?.user?.email ?? "-"}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {selectedOrder?.user?.phone ?? "-"}
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      Status Pembayaran
                    </p>
                    <div>
                      {(() => {
                        const payInfo = paymentStatusConfig[selectedOrder?.payment_status ?? "UNPAID"];
                        const PayIcon = payInfo.icon;
                        return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${payInfo.classes}`}>
                            <PayIcon className="w-4 h-4" />
                            {payInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      Alamat Pengiriman
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-1.5 text-sm">
                      <p className="text-gray-700"><strong>Provinsi:</strong> {selectedOrder?.province ?? "-"}</p>
                      <p className="text-gray-700"><strong>Kab/Kota:</strong> {selectedOrder?.regency ?? "-"}</p>
                      <p className="text-gray-700"><strong>Kecamatan:</strong> {selectedOrder?.district ?? "-"}</p>
                      <p className="text-gray-700"><strong>Desa:</strong> {selectedOrder?.village ?? "-"}</p>
                      <p className="text-gray-700"><strong>Detail:</strong> {selectedOrder?.address_detail ?? "-"}</p>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-600" />
                      Jasa Pengiriman
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ekspedisi:</span>
                        <span className="font-semibold text-gray-900">{selectedOrder?.ekspedition ?? "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">No Resi:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{selectedOrder?.no_resi ?? "-"}</span>
                          {selectedOrder?.no_resi && (
                            <button
                              onClick={() => copyResi(selectedOrder.no_resi)}
                              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                              title="Copy resi"
                            >
                              <Clipboard className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Biaya Kirim:</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(selectedOrder?.shipping_cost)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Resi */}
                  <div className="mb-5 bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Edit className="w-4 h-4 text-blue-600" />
                      Edit Resi Pengiriman
                    </p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Ekspedisi (opsional)"
                        value={resiForm.ekspedition}
                        onChange={(e) => setResiForm({ ...resiForm, ekspedition: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all
                          ${selectedOrder?.payment_status !== "PAID" ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
                        disabled={selectedOrder?.payment_status !== "PAID"}
                      />

                      <input
                        type="text"
                        placeholder="Nomor Resi (wajib)"
                        value={resiForm.no_resi}
                        onChange={(e) => setResiForm({ ...resiForm, no_resi: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:outline-none transition-all
                          ${selectedOrder?.payment_status !== "PAID" ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`}
                        disabled={selectedOrder?.payment_status !== "PAID"}
                      />

                      <button
                        onClick={updateResi}
                        disabled={savingResi || selectedOrder?.payment_status !== "PAID"}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {savingResi ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menyimpan...
                          </>
                        ) : selectedOrder?.payment_status !== "PAID" ? (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Menunggu Pembayaran
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4" />
                            Simpan & Tandai Dikirim
                          </>
                        )}
                      </button>

                      {selectedOrder?.payment_status !== "PAID" && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Resi hanya bisa diinput setelah pembayaran PAID
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      Item Pesanan
                    </p>
                    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                      {selectedOrder?.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((it, i) => (
                          <div key={i} className="p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{it.product?.name ?? "Product"}</p>
                              <p className="text-xs text-gray-500">Qty: {it.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 text-sm">{formatCurrency(it.price)}</p>
                              <p className="text-xs text-gray-500">Subtotal: {formatCurrency(Number(it.price) * Number(it.quantity))}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 p-4 text-center text-sm">Tidak ada item</p>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex justify-between mb-2.5 text-sm">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(selectedOrder?.total_price ?? 0)}</span>
                    </div>
                    <div className="flex justify-between mb-2.5 text-sm">
                      <span className="text-gray-700">Ongkir</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(selectedOrder?.shipping_cost ?? 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2.5 border-t border-blue-200">
                      <span className="text-sm font-semibold text-gray-700">Total Pembayaran</span>
                      <span className="font-bold text-lg text-blue-700">{formatCurrency((Number(selectedOrder?.total_price || 0) + Number(selectedOrder?.shipping_cost || 0)))}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}