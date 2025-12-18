import React, { useState, useEffect } from "react";

export default function FloatingFormCategory({ onClose, onSubmit, initialData }) {
  const [name, setName] = useState("");
  
  useEffect(() => {
    if (initialData) setName(initialData.name);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name required!");
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    onSubmit({ name, slug, id: initialData?.id });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-start pt-20 z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-blue-200"
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-5">
          {initialData ? "Edit Category" : "Tambah Category"}
        </h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Category"
          className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400"
          required
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Tutup
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {initialData ? "Update" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
