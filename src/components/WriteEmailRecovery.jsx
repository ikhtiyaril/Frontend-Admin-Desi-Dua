import React,{useState} from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const WriteEmailRecovery = () => {
const [email,setEmail] = useState('')
const navigation = useNavigate()
  const handleRecovery = async (e) => {
    e.preventDefault();
    try {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/send`, { email });
  if(res.data.success){
    localStorage.setItem("recoveryEmail", email);
    navigation('/recovery/OTP');
  } else {
    alert(res.data.message || "Gagal mengirim email");
  }
} catch (error) {
  console.error(error);
  alert("Terjadi kesalahan, coba lagi nanti");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100">

        {/* Header */}
        <h2 className="text-3xl font-semibold text-blue-700 text-center mb-6">
          Pulihkan Akun
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Masukkan email Anda untuk menerima link pemulihan password.
        </p>

        {/* Form */}
        <form onSubmit={handleRecovery} className="space-y-5">
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Masukkan Email Anda"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition shadow-md"
          >
            Kirim Link Pemulihan
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 KlinikCare — All Rights Reserved
        </p>

      </div>
    </div>
  );
};

export default WriteEmailRecovery;
