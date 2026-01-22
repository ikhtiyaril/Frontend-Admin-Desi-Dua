import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";

export default function FloatingArticleForm({ onClose, onSubmit, initialData, categories }) {
  const editorRef = useRef(null);
  const ejInstance = useRef(null);
  const fileInputRef = useRef(null); // Ref untuk input file tersembunyi

  const [id, setId] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnail, setThumbnail] = useState(""); // Menyimpan URL thumbnail
  const [isUploading, setIsUploading] = useState(false); // Loading state untuk upload
  const [status, setStatus] = useState("draft");

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!id) setSlug(generateSlug(val));
  };

  /* ================= HANDLER UPLOAD THUMBNAIL ================= */
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); // Key harus 'image' sesuai upload.single("image") di backend

    setIsUploading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success === 1) {
        setThumbnail(result.file.url); // Set URL dari backend ke state thumbnail
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      alert("Error uploading thumbnail");
    } finally {
      setIsUploading(false);
    }
  };

  /* ================= INIT DATA & EDITOR (Sama seperti sebelumnya) ================= */
  useEffect(() => {
    if (initialData) {
      setId(initialData.id || null);
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setExcerpt(initialData.excerpt || "");
      setCategoryId(initialData.category_id || "");
      setThumbnail(initialData.thumbnail || "");
      setStatus(initialData.status || "draft");
    }
  }, [initialData]);

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: editorRef.current,
        data: initialData?.content || { blocks: [] },
        tools: {
          header: { class: Header, inlineToolbar: true },
          list: { class: List, inlineToolbar: true },
          paragraph: { class: Paragraph, inlineToolbar: true },
          image: {
            class: ImageTool,
            config: {
              endpoints: { byFile: `${import.meta.env.VITE_API_URL}/api/posts/upload` },
              field: "image",
              additionalRequestHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          },
        },
        placeholder: "Tulis isi artikel...",
      });
      ejInstance.current = editor;
    }
    return () => {
      if (ejInstance.current?.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [initialData]);

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim()) return alert("Title and Slug are required");
    const content = await ejInstance.current.save();
    onSubmit({ id, title, slug, excerpt, category_id: categoryId, content, thumbnail, status });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-start pt-10 pb-10 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col my-auto">
        
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">{id ? "Edit Article" : "New Article"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
        </div>

        {/* BODY */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI (EDITOR) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                className="w-full px-4 py-2 text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter title..."
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="border border-gray-300 rounded-lg bg-gray-50 p-4 min-h-[450px]">
              <div ref={editorRef} />
            </div>
          </div>

          {/* KOLOM KANAN (SIDEBAR/SETTINGS) */}
          <div className="space-y-6">
            
            {/* BAGIAN THUMBNAIL DENGAN PREVIEW */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Article Thumbnail</label>
              
              <div className="relative group border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 flex flex-col items-center justify-center min-h-[180px] transition hover:border-blue-400">
                {thumbnail ? (
                  <>
                    <img src={thumbnail} alt="Preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-semibold"
                      >
                        Change
                      </button>
                      <button 
                        onClick={() => setThumbnail("")}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                    ) : (
                      <>
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-xs font-medium">Click to upload thumbnail</span>
                      </>
                    )}
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleThumbnailUpload} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-xs uppercase tracking-wider">Slug</label>
              <input
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-50 text-gray-600 font-mono"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Write a short summary..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="p-4 bg-gray-50 border rounded-xl">
              <span className="block text-sm font-semibold text-gray-700 mb-3">Status</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setStatus("draft")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition ${status === 'draft' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                  Draft
                </button>
                <button 
                  onClick={() => setStatus("published")}
                  className={`flex-1 py-2 text-sm rounded-lg border transition ${status === 'published' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-600 border-gray-300'}`}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2 text-gray-600 font-medium hover:underline">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`px-10 py-2.5 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95 ${
              isUploading ? "bg-gray-400 cursor-not-allowed" : status === "published" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading Image..." : id ? "Update Article" : "Save Article"}
          </button>
        </div>

      </div>
    </div>
  );
}