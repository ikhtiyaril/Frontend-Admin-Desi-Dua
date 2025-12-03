import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-lg font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">📦 Manajemen Pesanan</h1>

      {orders.length < 0 ? (
        <p className="text-gray-600">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-5 bg-white shadow-sm"
            >
              {/* Header Order Info */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Order #{order.id} •{" "}
                  <span className="text-blue-600">{order.status}</span>
                </h2>

                <select
                  className="border px-3 py-2 rounded-md text-sm"
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

              {/* Customer Info */}
              <div className="mt-3 text-sm text-gray-700">
                <p>👤 {order.user?.name}</p>
                <p>📞 {order.user?.phone}</p>
                <p>📧 {order.user?.email}</p>
              </div>

              {/* Items */}
              <div className="mt-4">
                <h3 className="font-medium mb-2">Items:</h3>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <span>
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span>Rp {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 font-semibold text-right text-lg">
                Total: Rp {order.total_price.toLocaleString()}
              </div>

              {/* Detail Button */}
              <div className="mt-4 text-right">
                <button
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="text-sm px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
