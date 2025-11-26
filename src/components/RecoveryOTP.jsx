import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecoveryOTP = () => {
  const [step, setStep] = useState("otp"); // otp | newPassword
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate()

  // email disimpan dari halaman sebelumnya
  const email = localStorage.getItem("recoveryEmail");

  const API = import.meta.env.VITE_API_URL; // contoh: http://localhost:5000

  // 1️⃣ Verifikasi OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/user/verifikasi`, {
        email,
        otp,
      });

      if (res.data.success) {
        setStep("newPassword");
      
      } else {
        alert(res.data.message || "OTP salah!");
      }
    } catch (err) {
      console.log(err);
      alert("Gagal verifikasi OTP");
    }

    setLoading(false);
  };

  // 2️⃣ Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password tidak sama!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/user/reset-password`, {
        email,
        password,
      });

      if (res.data.success) {
        alert("Password berhasil diperbarui!");
          navigation('/recovery/done')
      } else {
        alert("Gagal memperbarui password!");
      }
    } catch (err) {
      console.log(err);
      alert("Terjadi kesalahan server!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100">

        <h2 className="text-3xl font-semibold text-blue-700 text-center mb-6">
          Pemulihan Akun
        </h2>

        {/* ---------------- OTP STEP ---------------- */}
        {step === "otp" && (
          <>
            <p className="text-center text-sm text-gray-600 mb-6">
              Masukkan kode OTP yang dikirim ke email Anda.
            </p>

            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Kode OTP
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Masukkan 6 digit OTP"
                  className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition shadow-md"
              >
                {loading ? "Memverifikasi..." : "Verifikasi OTP"}
              </button>
            </form>
          </>
        )}

        {/* ---------------- NEW PASSWORD STEP ---------------- */}
        {step === "newPassword" && (
          <>
            <p className="text-center text-sm text-gray-600 mb-6">
              OTP terverifikasi. Silakan masukkan password baru Anda.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password Baru"
                  className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-700 font-medium">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ulangi Password Baru"
                  className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition shadow-md"
              >
                {loading ? "Menyimpan..." : "Perbarui Password"}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 KlinikCare — All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default RecoveryOTP;
