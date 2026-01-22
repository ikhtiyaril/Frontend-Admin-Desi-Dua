import { useEffect, useState } from "react";
import axios from "axios";
import { 
  RefreshCw, Filter, User, CreditCard, Building2, 
  CheckCircle, XCircle, Clock, Upload, Check, 
  ChevronRight, Wallet, AlertCircle 
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageWithdraw() {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedProof, setSelectedProof] = useState({});
  const token = localStorage.getItem("token");

  const fetchWithdraws = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/revenue/admin/withdraw${statusFilter ? `?status=${statusFilter}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdraws(res.data.data);
    } catch (err) {
      alert("Failed to load withdraw requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("status", status);

      if (status === "paid") {
        if (!selectedProof[id]) {
          return alert("Upload proof image first");
        }
        formData.append("proof_image", selectedProof[id]);
      }

      await axios.put(`${API_URL}/api/revenue/admin/withdraw/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      fetchWithdraws();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved": return "bg-blue-100 text-blue-700 border-blue-200";
      case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-3.5 h-3.5" />;
      case "approved": return <CheckCircle className="w-3.5 h-3.5" />;
      case "paid": return <Check className="w-3.5 h-3.5" />;
      case "rejected": return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Withdrawal Panel</h1>
            <p className="text-slate-500 mt-1">Review and process doctor revenue payouts.</p>
          </div>
          <button
            onClick={fetchWithdraws}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium text-sm">Refresh Data</span>
          </button>
        </div>

        {/* Quick Stats (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Pending', count: withdraws.filter(w => w.status === 'pending').length, color: 'amber' },
            { label: 'To be Paid', count: withdraws.filter(w => w.status === 'approved').length, color: 'blue' },
            { label: 'Success', count: withdraws.filter(w => w.status === 'paid').length, color: 'emerald' },
            { label: 'Total Requests', count: withdraws.length, color: 'slate' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                <Wallet className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 px-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-semibold">Status:</span>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["", "pending", "approved", "paid", "rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                    statusFilter === s 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {s === "" ? "All Requests" : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Desktop Table / Mobile Cards */}
        <div className="space-y-4">
          
          {/* Desktop Table - Hidden on Mobile */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Doctor Details</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Bank Account</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Proof</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {withdraws.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{w.doctor?.name}</p>
                          <p className="text-xs text-slate-500">{w.doctor?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-extrabold text-slate-900">
                        Rp {Number(w.amount).toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-700 uppercase">{w.bank_name}</p>
                        <p className="text-xs font-mono text-slate-500">{w.bank_account}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic">{w.account_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border ${getStatusStyle(w.status)}`}>
                        {getStatusIcon(w.status)} {w.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <ProofUploader w={w} selectedProof={selectedProof} setSelectedProof={setSelectedProof} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButtons w={w} handleStatusUpdate={handleStatusUpdate} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View - Visible on Mobile only */}
          <div className="lg:hidden space-y-4">
            {withdraws.map((w) => (
              <div key={w.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{w.doctor?.name}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold border ${getStatusStyle(w.status)}`}>
                        {w.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="font-black text-slate-900">Rp {Number(w.amount).toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{w.bank_name}</p>
                      <p className="text-xs font-mono text-slate-500">{w.bank_account}</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 italic">{w.account_name}</div>
                </div>

                <div className="pt-2">
                  <ProofUploader w={w} selectedProof={selectedProof} setSelectedProof={setSelectedProof} isMobile />
                </div>

                <div className="flex gap-2 pt-2">
                  <ActionButtons w={w} handleStatusUpdate={handleStatusUpdate} isMobile />
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && withdraws.length === 0 && (
            <div className="bg-white rounded-2xl py-20 text-center border border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold">No Records Found</h3>
              <p className="text-slate-500 text-sm">There are no withdrawal requests for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for Proof Upload logic
const ProofUploader = ({ w, selectedProof, setSelectedProof, isMobile }) => {
  if (w.status === "paid") {
    return (
      <div className={`flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 ${isMobile ? 'w-full justify-center' : ''}`}>
        <CheckCircle className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Proof Sent</span>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <label className={`flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-xl cursor-pointer transition-all ${isMobile ? 'justify-center' : ''}`}>
        <Upload className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          {selectedProof[w.id] ? "Change Image" : "Upload Proof"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setSelectedProof({ ...selectedProof, [w.id]: e.target.files[0] })}
        />
      </label>
      {selectedProof[w.id] && (
        <p className="text-[10px] text-blue-500 mt-1.5 font-medium text-center truncate px-2">
          📎 {selectedProof[w.id].name}
        </p>
      )}
    </div>
  );
};

// Sub-component for Action Buttons
const ActionButtons = ({ w, handleStatusUpdate, isMobile }) => {
  if (w.status === "pending") {
    return (
      <>
        <button
          onClick={() => handleStatusUpdate(w.id, "approved")}
          className={`${isMobile ? 'flex-1' : ''} flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm text-xs font-bold`}
        >
          <CheckCircle className="w-4 h-4" /> Approve
        </button>
        <button
          onClick={() => handleStatusUpdate(w.id, "rejected")}
          className={`${isMobile ? 'flex-1' : ''} flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all text-xs font-bold`}
        >
          <XCircle className="w-4 h-4" /> Reject
        </button>
      </>
    );
  }

  if (w.status === "approved") {
    return (
      <button
        onClick={() => handleStatusUpdate(w.id, "paid")}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md shadow-emerald-100 text-xs font-bold uppercase tracking-widest"
      >
        <CreditCard className="w-4 h-4" /> Mark as Paid
      </button>
    );
  }

  if (w.status === "paid") {
    return (
       <div className="w-full py-2 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
         <Check className="w-3 h-3" /> Transaction Completed
       </div>
    );
  }

  return null;
};