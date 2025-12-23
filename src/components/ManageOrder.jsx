import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus, FaUserMd } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function ManageOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const statusConfig = {
    pending: { 
      bg: "bg-yellow-50", 
      text: "text-yellow-700", 
      border: "border-yellow-200",
      label: "Pending",
      emoji: "⏳"
    },
    processing: { 
      bg: "bg-blue-50", 
      text: "text-blue-700", 
      border: "border-blue-200",
      label: "Processing",
      emoji: "⚙️"
    },
    shipped: { 
      bg: "bg-purple-50", 
      text: "text-purple-700", 
      border: "border-purple-200",
      label: "Shipped",
      emoji: "🚚"
    },
    delivered: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      border: "border-green-200",
      label: "Delivered",
      emoji: "📦"
    },
    completed: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-700", 
      border: "border-emerald-200",
      label: "Completed",
      emoji: "✅"
    },
    cancelled: { 
      bg: "bg-red-50", 
      text: "text-red-700", 
      border: "border-red-200",
      label: "Cancelled",
      emoji: "❌"
    },
  };

  // ===== Fetch semua orders admin =====
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : [res.data.orders]);
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
      await axios.put(
        `${API}/api/orders/admin/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrders();
      alert(`Status order #${id} diubah menjadi ${status}`);
    } catch (err) {
      console.error(err);
      alert("Gagal update status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
     <div className="max-w-7xl mx-auto mb-6 md:mb-8">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                 <FaUserMd className="text-white text-2xl" />
               </div>
               <div>
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                   Manajemen Order
                 </h2>
                 <p className="text-sm md:text-base text-gray-600 mt-1">Kelola data pesanan obat</p>
               </div>
             </div>
           </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Total Pesanan</p>
          <p className="text-gray-900 text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Pending</p>
          <p className="text-yellow-600 text-2xl font-bold">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Processing</p>
          <p className="text-blue-600 text-2xl font-bold">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Completed</p>
          <p className="text-green-600 text-2xl font-bold">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
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
                const statusInfo = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📦</span>
                        <span className="font-semibold text-blue-700">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👤</span>
                        <span className="text-gray-900 font-medium">{order.user?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📞</span>
                          <span>{order.user?.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">✉️</span>
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
                          <span className="text-xs text-blue-600">+{order.items.length - 2} lainnya</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-gray-900">
                        Rp {order.total_price ? order.total_price.toLocaleString('id-ID') : '0'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                        {statusInfo.emoji} {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select
                        className="px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white font-medium"
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
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        👁️ Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => {
          const statusInfo = statusConfig[order.status];
          
          return (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📦</span>
                    <p className="text-blue-700 font-bold text-lg">Order #{order.id}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                    {statusInfo.emoji} {statusInfo.label}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs mb-1">Total</p>
                  <p className="font-bold text-gray-900 text-lg">
                    Rp {order.total_price ? order.total_price.toLocaleString('id-ID') : '0'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Pelanggan</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    {order.user?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Kontak</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700 flex items-center gap-2">
                      <span>📞</span>
                      {order.user?.phone || "-"}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <span>✉️</span>
                      {order.user?.email || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Produk</p>
                  <div className="space-y-1 text-sm">
                    {order.items && order.items.length > 0 ? (
                      <>
                        {order.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} className="text-gray-700">
                            {item.product?.name || "Product"} × {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-blue-600">+{order.items.length - 2} produk lainnya</span>
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
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white font-medium"
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
              </div>

              {/* Detail Button */}
              <button
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                👁️ Lihat Detail Lengkap
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
          <p className="text-gray-500">Pesanan akan muncul di sini saat pelanggan melakukan pemesanan</p>
        </div>
      )}
    </div>
  );
}