import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaPills, FaImage } from "react-icons/fa";
import FloatingFormProduct from "./FloatingFormProduct";

const API = import.meta.env.VITE_API_URL;

export default function MedicineManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/medicine/products`);
    setProducts(res.data.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API}/api/categories`);
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (data, file, id) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("description", data.description);
    formData.append("category_id", data.category_id);
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    formData.append("is_prescription_required", data.is_prescription_required);
    if (file) formData.append("image", file);

    try {
      if (id) {
        await axios.put(`${API}/api/medicine/admin/products/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.token}`, "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post(`${API}/api/medicine/admin/products`, formData, {
          headers: { Authorization: `Bearer ${localStorage.token}`, "Content-Type": "multipart/form-data" }
        });
      }
      fetchProducts();
      setEditProduct(null);
    } catch (err) {
      console.error(err);
      alert("Error submitting data");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    try {
      await axios.delete(`${API}/api/medicine/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error deleting");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <FaPills className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Manajemen Produk Obat
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">Kelola stok dan informasi produk obat</p>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Gambar</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Nama Produk</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold whitespace-nowrap">Harga</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Stok</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Kategori</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Resep Dokter</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      {p.image_url ? (
                        <img 
                          src={p.image_url} 
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded-lg ring-2 ring-blue-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                          <FaImage className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        {p.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-gray-900">
                        Rp {Number(p.price).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        p.stock > 10 ? 'bg-green-100 text-green-800' :
                        p.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {p.stock} unit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {p.category?.name || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        p.is_prescription_required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {p.is_prescription_required ? 'Ya' : 'Tidak'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-150"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
          {products.length === 0 && (
            <div className="text-center py-12">
              <FaPills className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-sm font-medium text-gray-900">Belum ada produk</h3>
              <p className="mt-1 text-sm text-gray-500">Klik tombol + untuk menambah produk baru</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="lg:hidden max-w-4xl mx-auto space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex gap-4">
                {p.image_url ? (
                  <img 
                    src={p.image_url} 
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-lg ring-2 ring-blue-100 shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaImage className="text-gray-400 text-2xl" />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Harga</p>
                    <p className="text-lg font-bold text-gray-900">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Stok</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      p.stock > 10 ? 'bg-green-100 text-green-800' :
                      p.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {p.stock} unit
                    </span>
                  </div>
                </div>
              </div>

              {p.description && (
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Deskripsi</p>
                  <p className="text-sm text-gray-700">{p.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Kategori</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {p.category?.name || "-"}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Resep Dokter</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    p.is_prescription_required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {p.is_prescription_required ? 'Ya' : 'Tidak'}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium text-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
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
        {products.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-12 text-center">
            <FaPills className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-base font-medium text-gray-900">Belum ada produk</h3>
            <p className="mt-2 text-sm text-gray-500">Klik tombol + untuk menambah produk baru</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => { setShowForm(true); setEditProduct(null); }}
        className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl flex justify-center items-center text-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 z-50"
      >
        <FaPlus />
      </button>

      {/* Floating Form */}
      {showForm && (
        <FloatingFormProduct
          initialData={editProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}