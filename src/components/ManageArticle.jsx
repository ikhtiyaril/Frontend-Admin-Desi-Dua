import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import FloatingArticleForm from "./FloatingArticleForm";
import { FaPlus, FaEdit, FaTrash, FaNewspaper, FaTag } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "";

export default function ManageArticle() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  const loadArticles = async () => {
    const res = await axios.get(`${API}/api/posts`);
    setArticles(res.data.data || []);
  };

  const loadCategories = async () => {
    const res = await axios.get(`${API}/api/categories`);
    setCategories(res.data.data || []);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus artikel ini?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(`${API}/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadArticles();
  };

  const handleSubmit = async (payload) => {
    const token = localStorage.getItem("token");

    if (isEdit) {
      await axios.put(`${API}/api/posts/${editData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${API}/api/posts`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setShowForm(false);
    setIsEdit(false);
    setEditData(null);
    loadArticles();
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-red-100 text-red-800",
    };
    return styles[status] || "bg-blue-100 text-blue-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <FaNewspaper className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Manajemen Artikel
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Kelola artikel dan konten blog</p>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Judul Artikel</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FaNewspaper className="text-blue-600 text-lg flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{a.title}</p>
                          {a.slug && (
                            <p className="text-xs text-gray-500 mt-1">/{a.slug}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {a.category?.name ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <FaTag className="text-xs" />
                          {a.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setIsEdit(true);
                            setEditData(a);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
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
          {articles.length === 0 && (
            <div className="text-center py-12">
              <FaNewspaper className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900">Belum ada artikel</h3>
              <p className="mt-1 text-sm text-gray-500">Klik tombol + untuk membuat artikel baru</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden max-w-4xl mx-auto space-y-4">
        {articles.map((a) => (
          <div key={a.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <FaNewspaper className="text-white text-lg" />
                <h3 className="text-lg font-bold text-white line-clamp-1">{a.title}</h3>
              </div>
              {a.slug && (
                <p className="text-xs text-blue-100">/{a.slug}</p>
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Kategori</p>
                  {a.category?.name ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <FaTag className="text-xs" />
                      {a.category.name}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Tidak ada</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsEdit(true);
                    setEditData(a);
                    setShowForm(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
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
        {articles.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-12 text-center">
            <FaNewspaper className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-base font-medium text-gray-900">Belum ada artikel</h3>
            <p className="mt-2 text-sm text-gray-500">Klik tombol + untuk membuat artikel baru</p>
          </div>
        )}
      </div>

      {/* FLOATING PLUS */}
      <button
        onClick={() => {
          setIsEdit(false);
          setEditData(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex justify-center items-center text-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 z-50"
      >
        <FaPlus />
      </button>

      {/* FLOATING FORM */}
      {showForm && (
        <FloatingArticleForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          initialData={editData}
          categories={categories}
        />
      )}
    </div>
  );
}