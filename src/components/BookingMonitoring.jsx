import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingMonitoring() {
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
  };

  const paymentStyle = {
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-orange-100 text-orange-800",
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/api/booking`);
      setData(res.data);
    } catch (error) {
      console.error("Gagal fetch booking:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`${API}/api/booking/${id}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal mengubah status");
    }
  };

  // -------------------------------
  //  ACTION BUTTON LOGIC
  // -------------------------------
  const renderActions = (item) => {
    const st = item.status;

    // Pending => Confirm / Cancel
    if (st === "pending") {
      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => updateStatus(item.id, "confirmed")}
            className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            Confirm
          </button>
          <button
            onClick={() => updateStatus(item.id, "cancelled")}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      );
    }

    // Confirmed => Complete
    if (st === "confirmed") {
      return (
        <div className="flex justify-center">
          <button
            onClick={() => updateStatus(item.id, "completed")}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Complete
          </button>
        </div>
      );
    }

    // Cancelled => Active (back to pending)
    if (st === "cancelled") {
      return (
        <div className="flex justify-center">
          <button
            onClick={() => updateStatus(item.id, "pending")}
            className="px-3 py-1.5 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-700 transition-colors whitespace-nowrap"
          >
            Activate
          </button>
        </div>
      );
    }

    // Completed => No actions
    return (
      <div className="flex justify-center">
        <span className="text-gray-400 text-xs italic">Selesai</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Monitoring Dashboard
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Pantau dan kelola status booking secara real-time</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Table Container with Horizontal Scroll */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Kode Booking</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Pasien</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Layanan</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">Dokter</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Tanggal</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Waktu</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Status Booking</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Status Pembayaran</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-4 py-4 font-semibold text-blue-700 whitespace-nowrap">
                      {item.booking_code}
                    </td>
                    <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                      {item.patient?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                      {item.Service?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      {item.doctor?.name || <span className="text-gray-400 italic">Belum ditentukan</span>}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-700 whitespace-nowrap">
                      {item.time_start} - {item.time_end}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${paymentStyle[item.payment_status]}`}>
                        {item.payment_status === "paid" ? "Lunas" : "Belum Bayar"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {renderActions(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && data.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Belum ada booking</h3>
              <p className="mt-1 text-sm text-gray-500">Booking akan muncul di sini saat ada data baru</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}