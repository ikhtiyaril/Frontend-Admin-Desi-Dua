import { useEffect, useRef, useState } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import ImageTool from "@editorjs/image";

const API = import.meta.env.VITE_API_URL || "";

export default function ManageArticle() {
  const editorRef = useRef(null);
  const ejInstance = useRef(null);

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  /* ================= INIT EDITOR.JS ================= */
  useEffect(() => {
    if (!editorRef.current || ejInstance.current) return;

    ejInstance.current = new EditorJS({
      holder: editorRef.current,
      autofocus: true,
      placeholder: "Write your article here…",
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append("image", file);

                const token = localStorage.getItem("token");
                const res = await axios.post(
                  `${API}/api/posts/upload`,
                  formData,
                  {
                    headers: {
                      Authorization: token ? `Bearer ${token}` : "",
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );

                const url = res?.data?.file?.url || res?.data?.url;
                return {
                  success: 1,
                  file: { url },
                };
              },
            },
          },
        },
      },
    });

    return () => {
  if (typeof ejInstance.current?.destroy === "function") {
    ejInstance.current.destroy();
    ejInstance.current = null;
  }
};

  }, []);

  /* ================= LOAD DATA ================= */
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

  /* ================= THUMBNAIL PREVIEW ================= */
  useEffect(() => {
    if (!thumbnailFile) return setThumbnailPreview(null);
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return null;

    const formData = new FormData();
    formData.append("image", thumbnailFile);
    const token = localStorage.getItem("token");

    const res = await axios.post(`${API}/api/posts/upload`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    });

    return res?.data?.file?.url || res?.data?.url || null;
  };

  /* ================= SUBMIT ================= */
  const submitArticle = async () => {
    if (!title.trim()) return alert("Title is required");

    const content = await ejInstance.current.save();
    if (!content.blocks.length) return alert("Content is empty");

    const thumbnailUrl = await uploadThumbnail();
    const token = localStorage.getItem("token");

    const payload = {
      title,
      excerpt,
      category_id: categoryId || null,
      thumbnail: thumbnailUrl,
      content: content,
      status: "published",
    };

    await axios.post(`${API}/api/posts`, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    setTitle("");
    setExcerpt("");
    setCategoryId("");
    setThumbnailFile(null);
    setThumbnailPreview(null);
    ejInstance.current.clear();

    await loadArticles();
    alert("Article published 🚀");
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>

      <section className="mb-10">
        <div className="grid gap-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={3}
            className="border px-3 py-2 rounded"
            placeholder="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Select category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0])}
          />

          {thumbnailPreview && (
            <img src={thumbnailPreview} className="h-32 rounded" />
          )}

          <div className="border rounded p-4 bg-white">
            <div ref={editorRef} />
          </div>

          <button
            onClick={submitArticle}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Publish
          </button>
        </div>
      </section>
    </div>
  );
}
