"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import api from "@/lib/axios";

export default function DashboardPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileId = res.data.doc._id;

      router.push(`/chat/${fileId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-[2rem] bg-[#1c1b1d] p-12">

        <h1 className="text-5xl font-bold text-center mb-10">
          Upload PDF
        </h1>

        <label className="border border-dashed border-indigo-500 rounded-3xl p-20 flex flex-col items-center gap-5 cursor-pointer hover:bg-white/5">
          <FiUpload size={40} />
          <span className="text-lg">
            {file ? file.name : "Choose PDF"}
          </span>

          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full mt-8 bg-indigo-600 py-5 rounded-2xl text-lg font-medium disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Uploading..." : "Upload & Chat"}
        </button>
      </div>
    </div>
  );
}