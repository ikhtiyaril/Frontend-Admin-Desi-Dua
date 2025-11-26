import React from "react";

const RecoveryDone = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-blue-100 text-center">

        {/* Icon Success */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12l2.5 2.5L16 9"
            />
          </svg>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">
          Password Berhasil Diperbarui
        </h2>
        <p className="text-gray-600 text-sm mb-8">
          Password Anda telah diganti. Sekarang Anda bisa login kembali ke akun Anda.
        </p>

        {/* Button to Login */}
        <a
          href="/login"
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition shadow-md"
        >
          Kembali ke Login
        </a>

        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 KlinikCare — All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default RecoveryDone;
