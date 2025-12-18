import React, { useState, useEffect } from "react";

export default function FloatingFormBlockedTime({ onClose, onSubmit, initialData, doctorId, date }) {
  const [form, setForm] = useState({
    time_start: "",
    time_end: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.time_start || !form.time_end) {
      alert("Jam mulai & jam akhir wajib diisi!");
      return;
    }
    onSubmit({ ...form, doctor_id: doctorId, date });
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-start pt-20 z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-blue-200"
      >
        <h3 className="text-2xl font-semibold text-blue-700 mb-5">
          {initialData ? "Edit Blocked Time" : "Tambah Blocked Time"}
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium mb-1">Jam Mulai</label>
            <input
              type="time"
              name="time_start"
              value={form.time_start}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Jam Akhir</label>
            <input
              type="time"
              name="time_end"
              value={form.time_end}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Tutup</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{initialData ? "Update" : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
}
