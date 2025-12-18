import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaTags, FaClock } from "react-icons/fa";
import FloatingFormCategory from "./FloatingFormCategory";

const API = import.meta.env.VITE_API_URL;

export default function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (data.id) {
        await axios.put(`${API}/api/categories/${data.id}`, { name: data.name, slug: data.slug });
        alert("Category updated!");
      } else {
        await axios.post(`${API}/api/categories`, { name: data.name, slug: data.slug });
        alert("Category created!");
      }
      fetchCategories();
      setEditCategory(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Error occurred");
    }
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus kategori ini?")) return;
    try {
      await axios.delete(`${API}/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <FaTags className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Manajemen Kategori
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Kelola kategori produk dan layanan</p>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Nama Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Slug</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Tanggal Dibuat</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {cat.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaTags className="text-blue-600" />
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-mono">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-gray-400" />
                        {new Date(cat.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-150"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="text-center py-12">
              <FaTags className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900">Belum ada kategori</h3>
              <p className="mt-1 text-sm text-gray-500">Klik tombol + untuk menambah kategori baru</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden max-w-4xl mx-auto space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-600 font-bold text-sm">
                  {cat.id}
                </span>
                <h3 className="text-lg font-bold text-white">{cat.name}</h3>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Slug URL</p>
                <code className="block px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm font-mono">
                  {cat.slug}
                </code>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Tanggal Dibuat</p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaClock className="text-gray-400" />
                  {new Date(cat.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaTrash className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State Mobile */}
        {categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-12 text-center">
            <FaTags className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-base font-medium text-gray-900">Belum ada kategori</h3>
            <p className="mt-2 text-sm text-gray-500">Klik tombol + untuk menambah kategori baru</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => { setShowForm(true); setEditCategory(null); }}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex justify-center items-center text-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 z-50"
      >
        <FaPlus />
      </button>

      {/* Floating Form */}
      {showForm && (
        <FloatingFormCategory
          initialData={editCategory}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}