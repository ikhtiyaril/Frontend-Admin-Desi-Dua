import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingMonitoring() {
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    pending: { 
      bg: "bg-yellow-50", 
      text: "text-yellow-700", 
      border: "border-yellow-200",
      label: "Menunggu",
      emoji: "⏳"
    },
    confirmed: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      border: "border-green-200",
      label: "Terkonfirmasi",
      emoji: "✅"
    },
    cancelled: { 
      bg: "bg-red-50", 
      text: "text-red-700", 
      border: "border-red-200",
      label: "Dibatalkan",
      emoji: "❌"
    },
    completed: { 
      bg: "bg-blue-50", 
      text: "text-blue-700", 
      border: "border-blue-200",
      label: "Selesai",
      emoji: "✔️"
    },
  };

  const paymentConfig = {
    paid: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      border: "border-green-200",
      label: "Lunas",
      emoji: "💰"
    },
    unpaid: { 
      bg: "bg-orange-50", 
      text: "text-orange-700", 
      border: "border-orange-200",
      label: "Belum Bayar",
      emoji: "⏱️"
    },
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

  const renderActions = (item) => {
    const st = item.status;

    if (st === "pending") {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => updateStatus(item.id, "confirmed")}
            className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            ✓ Konfirmasi
          </button>
          <button
            onClick={() => updateStatus(item.id, "cancelled")}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            ✕ Batalkan
          </button>
        </div>
      );
    }

    if (st === "confirmed") {
  return (
    <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
        <span className="text-base">ℹ️</span>
        <span>Status: Dikonfirmasi</span>
      </div>

      <p className="mt-1 text-xs text-blue-600">
        Menunggu konfirmasi lanjutan dari pasien atau dokter
      </p>
    </div>
  );
}


    if (st === "cancelled") {
      return (
        <button
          onClick={() => updateStatus(item.id, "pending")}
          className="w-full px-4 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-xl hover:bg-yellow-700 transition-colors"
        >
          ↻ Aktifkan Kembali
        </button>
      );
    }

    return (
      <div className="text-center py-2">
        <span className="text-gray-400 text-sm italic">Selesai</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Monitoring Booking
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau dan kelola status booking secara real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Total Booking</p>
          <p className="text-gray-900 text-2xl font-bold">{data.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Pending</p>
          <p className="text-yellow-600 text-2xl font-bold">
            {data.filter(d => d.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Confirmed</p>
          <p className="text-green-600 text-2xl font-bold">
            {data.filter(d => d.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-xs mb-1">Completed</p>
          <p className="text-blue-600 text-2xl font-bold">
            {data.filter(d => d.status === 'completed').length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-4 text-left text-sm font-semibold">Kode</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Pasien</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Layanan</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Dokter</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Tanggal</th>
                <th className="px-4 py-4 text-left text-sm font-semibold">Waktu</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Status</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Pembayaran</th>
                <th className="px-4 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => {
                const statusInfo = statusConfig[item.status];
                const paymentInfo = paymentConfig[item.payment_status];
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-blue-700">
                      {item.booking_code}
                    </td>
                    <td className="px-4 py-4 text-gray-900">
                      {item.patient?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-900">
                      {item.Service?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {item.doctor?.name || <span className="text-gray-400 italic">Belum ditentukan</span>}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {item.date}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {item.time_start} - {item.time_end}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                        {statusInfo.emoji} {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${paymentInfo.bg} ${paymentInfo.text} ${paymentInfo.border} border`}>
                        {paymentInfo.emoji} {paymentInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="min-w-[180px]">
                        {renderActions(item)}
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
      <div className="lg:hidden space-y-4">
        {data.map((item) => {
          const statusInfo = statusConfig[item.status];
          const paymentInfo = paymentConfig[item.payment_status];
          
          return (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-700 font-bold text-lg">{item.booking_code}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.date} • {item.time_start}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} border`}>
                    {statusInfo.emoji} {statusInfo.label}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${paymentInfo.bg} ${paymentInfo.text} ${paymentInfo.border} border`}>
                    {paymentInfo.emoji} {paymentInfo.label}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Pasien</p>
                  <p className="text-gray-900 font-semibold">{item.patient?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Layanan</p>
                  <p className="text-gray-900 font-semibold">{item.Service?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">Dokter</p>
                  <p className="text-gray-900 font-semibold">
                    {item.doctor?.name || <span className="text-gray-400 italic">Belum ditentukan</span>}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {renderActions(item)}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Booking</h3>
          <p className="text-gray-500">Booking akan muncul di sini saat ada data baru</p>
        </div>
      )}
    </div>
  );
}