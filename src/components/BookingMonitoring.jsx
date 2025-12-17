import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingMonitoring() {
  const API = import.meta.env.VITE_API_URL;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    confirmed: "bg-green-100 text-green-700 border-green-300",
    cancelled: "bg-red-100 text-red-700 border-red-300",
    completed: "bg-blue-100 text-blue-700 border-blue-300",
  };

  const paymentStyle = {
    paid: "bg-green-100 text-green-700 border-green-300",
    unpaid: "bg-red-100 text-red-700 border-red-300",
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
        <div className="flex gap-2">
          <button
            onClick={() => updateStatus(item.id, "confirmed")}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
          >
            Confirm
          </button>
          <button
            onClick={() => updateStatus(item.id, "cancelled")}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      );
    }

    // Confirmed => Complete
    if (st === "confirmed") {
      return (
        <button
          onClick={() => updateStatus(item.id, "completed")}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
        >
          Complete
        </button>
      );
    }

    // Cancelled => Active (back to pending)
    if (st === "cancelled") {
      return (
        <button
          onClick={() => updateStatus(item.id, "pending")}
          className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700"
        >
          Activate
        </button>
      );
    }

    // Completed => No actions
    return null;
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Booking Monitoring Dashboard</h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}

      <div className="grid grid-cols-1 gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="border border-white/20 bg-white/50 backdrop-blur-md shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all duration-200"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-600">
                {item.booking_code}
              </span>

              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle[item.status]}`}
                >
                  {item.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${paymentStyle[item.payment_status]}`}
                >
                  {item.payment_status}
                </span>
              </div>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <p><span className="font-semibold">Patient:</span> {item.patient?.name}</p>
              <p><span className="font-semibold">Service:</span> {item.Service?.name}</p>
              <p><span className="font-semibold">Doctor:</span> {item.doctor?.name || "-"}</p>
              <p><span className="font-semibold">Date:</span> {item.date}</p>
              <p><span className="font-semibold">Time:</span> {item.time_start} - {item.time_end}</p>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-4">
              {renderActions(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
