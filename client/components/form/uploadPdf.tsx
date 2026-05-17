"use client";

import api from "@/lib/axios";
import { useState } from "react";

export default function UploadPdf() {
  const [loading, setLoading] = useState(false);

  async function handleUpload(file: File) {
    setLoading(true);

    // STEP 1 get presigned url
    const res = await api.post("/files/presign", {
      fileName: file.name,
      type: file.type,
    });

    const { uploadUrl, key } = res.data;

    // STEP 2 upload to s3
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

     //  await api.put(uploadUrl, file);

    // STEP 3 complete
    await api.post("/files/complete", {
      key,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });

    setLoading(false);
    alert("Uploaded. Processing started.");
  }

  return (
    <div className="p-10">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      {loading && <p>Uploading...</p>}
    </div>
  );
}