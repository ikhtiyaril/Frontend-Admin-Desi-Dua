import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";

export default function FloatingArticleForm({
  onClose,
  onSubmit,
  initialData,
  categories,
}) {
  const editorRef = useRef(null);
  const ejInstance = useRef(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");

  /* ================= INIT FORM DATA ================= */
  useEffect(() => {
    setTitle(initialData?.title || "");
    setExcerpt(initialData?.excerpt || "");
    setCategoryId(initialData?.category_id || "");
  }, [initialData]);

  /* ================= INIT EDITOR ================= */
  useEffect(() => {
    if (!editorRef.current) return;

    ejInstance.current = new EditorJS({
      holder: editorRef.current,
      autofocus: true,
      data: initialData?.content || { blocks: [] },
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
      },
    });

    return () => {
      if (ejInstance.current?.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, [initialData]); // 🔥 PENTING

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title required");

    const content = await ejInstance.current.save();

    onSubmit({
      title,
      excerpt,
      category_id: categoryId || null,
      content,
      status: "published",
    });
  };

  /* ================= LOCK BODY SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-10">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[85vh]">

        {/* HEADER */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-blue-700">
            {initialData ? "Edit Article" : "Add Article"}
          </h2>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto space-y-4">
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={3}
            className="border px-3 py-2 rounded w-full"
            placeholder="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded w-full"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="border rounded p-4 bg-white min-h-[300px]">
            <div ref={editorRef} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {initialData ? "Update" : "Publish"}
          </button>
        </div>

      </div>
    </div>
  );
}
