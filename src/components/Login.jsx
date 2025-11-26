import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [params] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ===============================
  // LOGIN FORM HANDLER
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100">

        <h2 className="text-3xl font-semibold text-blue-700 text-center mb-6">
          KlinikCare Login
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Masuk untuk mengelola layanan dan pasien
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              placeholder="Masukkan Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              focus:border-blue-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Password</label>
            <input
              type="password"
              required
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              focus:border-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 
            text-white font-medium p-3 rounded-lg transition shadow-md 
            disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

       

        { error && (
          <p className="text-center text-xs text-black mt-6">
            lupa kata sandi? pulihkan{" "}
            <a href="/recovery" className="text-blue-400">
              di sini
            </a>
          </p>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 KlinikCare — All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
