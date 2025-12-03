import { useEffect, useState, useRef } from "react";
import axios from "axios";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";

const API = import.meta.env.VITE_API_URL;

export default function ManageArticle() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const editorRef = useRef(null);
  const isEditorReady = useRef(false);

  // Load all articles
  const loadArticles = async () => {
    try {
      const res = await axios.get(`${API}/api/posts`);
      setArticles(res.data.data);
    } catch (error) {
      console.error("Load failed:", error);
    }
  };

  // Initialize EditorJS
  useEffect(() => {
    if (isEditorReady.current) return;
    isEditorReady.current = true;

    const initEditor = async () => {
      const editor = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        placeholder: "Write article here...",
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          header: {
            class: Header,
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
                uploadByFile: async (file) => {
                  try {
                    const formData = new FormData();
                    formData.append("image", file);

                    const token = localStorage.getItem("token");

                    const res = await axios.post(`${API}/api/posts/upload`, formData, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                      },
                    });
console.log("Full response:", res.data);
console.log("File object:", res.data.file);
console.log("Image URL:", res.data.file.url);


                    return { success: 1, file: { url:res.data.file.url } };
                  } catch (err) {
                    console.error("Image upload failed:", err);
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },
      });

      editorRef.current = editor;
    };

    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Submit article
  const submitArticle = async () => {
    try {
      if (!title.trim()) {
        alert("Title cannot be empty");
        return;
      }

      const editorData = await editorRef.current.save();

      // Filter out empty paragraph blocks
      const cleanBlocks = editorData.blocks.filter((block) => {
        if (block.type === "paragraph") {
          return block.data?.text?.trim() !== "";
        }
        return true;
      });

      if (cleanBlocks.length === 0) {
        alert("Please add some content");
        return;
      }

      const cleanData = { ...editorData, blocks: cleanBlocks };
      const token = localStorage.getItem("token"); // ambil token login

      await axios.post(
        `${API}/api/posts`,
        {
          title,
          content: JSON.stringify(cleanData),
          status: "published",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setTitle("");
      editorRef.current.clear();
      loadArticles();
      alert("Article Published!");
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to publish article. Check console.");
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Articles</h1>

      {/* Article List */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Existing Articles</h2>
        <div className="space-y-3">
          {articles.length > 0 ? (
            articles.map((a) => (
              <div key={a.id} className="border p-4 rounded bg-white shadow-sm">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-gray-600 text-sm">{a.excerpt ?? "No excerpt"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No articles yet.</p>
          )}
        </div>
      </div>

      <hr className="my-10" />

      {/* Create Article Form */}
      <h2 className="text-xl font-semibold mb-3">Create New Article</h2>

      <input
        className="border p-2 w-full mb-4 rounded"
        placeholder="Article Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div
        id="editorjs"
        className="border p-4 bg-white rounded shadow-sm min-h-[300px]"
      ></div>

      <button
        onClick={submitArticle}
        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
      >
        Publish Article
      </button>
    </div>
  );
}
