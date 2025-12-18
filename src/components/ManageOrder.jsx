import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaPhone, FaEnvelope, FaEye, FaBox } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;

export default function ManageOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ===== Fetch semua orders admin =====
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/orders/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("DATA FULL:", res.data);
      console.log("ORDERS:", res.data.orders);
      console.log(Array.isArray(res.data.orders));

      setOrders(Array.isArray(res.data.orders) ? res.data.orders : [res.data.orders]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data order.");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Orders updated:", orders);
  }, [orders]);

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

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <FaShoppingCart className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Manajemen Pesanan
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Kelola semua pesanan pelanggan</p>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Order ID</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Pelanggan</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Kontak</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Produk</th>
                  <th className="px-4 py-4 text-right text-sm font-semibold whitespace-nowrap">Total</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Update Status</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FaBox className="text-blue-600" />
                        <span className="font-semibold text-blue-700">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{order.user?.name || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaPhone className="text-gray-400 text-xs" />
                          <span>{order.user?.phone || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaEnvelope className="text-gray-400 text-xs" />
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
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select
                        className="px-3 py-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaEye />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {orders.length === 0 && (
            <div className="text-center py-12">
              <FaShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900">Belum ada pesanan</h3>
              <p className="mt-1 text-sm text-gray-500">Pesanan akan muncul di sini saat pelanggan melakukan pemesanan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}