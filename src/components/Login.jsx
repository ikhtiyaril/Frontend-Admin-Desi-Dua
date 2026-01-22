import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // LOGIN FORM HANDLER (LOGIC TETAP SAMA)
  // ===============================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/login/admin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal!");
        setLoading(false);
        return;
      }

      // Simpan token
      localStorage.setItem("token", data.token);

      // Redirect ke dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Server Error. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      
      {/* ===============================
          BAGIAN KIRI - VISUAL / ANIMASI
      =============================== */}
      <div className="hidden md:flex w-1/2 bg-blue-600 relative justify-center items-center">
        {/* Background Image Medis/Abstrak */}
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1470&auto=format&fit=crop')" }} // Gambar Medis Clean
        ></div>
        
        {/* Overlay Gradient Halus agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-700/80 to-blue-500/80"></div>

        {/* Konten Text Kiri */}
        <div className="relative z-10 px-12 text-center text-white">
            <div className="mb-6 flex justify-center">
                {/* Icon Simple Placeholder */}
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Desidua System</h1>
            <p className="text-lg text-blue-100 font-light leading-relaxed">
                Kelola data pasien, jadwal dokter, dan administrasi klinik dengan lebih mudah, cepat, dan terintegrasi.
            </p>
        </div>
      </div>

      {/* ===============================
          BAGIAN KANAN - FORM LOGIN
      =============================== */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 bg-white">
        
        <div className="w-full max-w-sm space-y-8">
            {/* Header Form */}
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Selamat Datang
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Silakan masukkan kredensial Anda untuk akses dashboard.
                </p>
            </div>

            {/* Error Message Box */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-pulse">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        placeholder="admin@klinikcare.id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                        text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" class="block text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        {error && (
                            <a href="/recovery" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                                Lupa password?
                            </a>
                        )}
                    </div>
                    <input
                        id="password"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 
                        text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent 
                    rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed 
                    transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Memproses...
                        </span>
                    ) : (
                        "Masuk ke Dashboard"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                    © 2025 Desidua System. All rights reserved.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;