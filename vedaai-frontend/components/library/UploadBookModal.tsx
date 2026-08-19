"use client"

import React, { useState } from "react";
import { X, Upload, FileType, Loader2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../app/lib/api";

interface UploadBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadBookModal({ isOpen, onClose, onSuccess }: UploadBookModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      if (title) formData.append("title", title);
      if (author) formData.append("author", author);

      await axios.post(`${API_URL}/api/books/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="qm-backdrop flex items-center justify-center p-4">
      <div className="rounded-3xl w-full max-w-md overflow-hidden qm-scale-in"
        style={{ background: "hsl(var(--qm-surface))", boxShadow: "var(--qm-shadow-xl)" }}
      >
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(var(--qm-border))" }}>
          <h2 className="text-[18px] font-bold" style={{ color: "hsl(var(--qm-text))" }}>Upload PDF Book</h2>
          <button onClick={onClose} className="p-2 rounded-full transition-colors"
            style={{ color: "hsl(var(--qm-text-muted))" }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium" style={{ color: "hsl(var(--qm-text-secondary))" }}>Book File</label>
            <div className="relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
              style={{
                borderColor: "hsl(var(--qm-border))",
                background: "hsl(var(--qm-bg-subtle))",
              }}
            >
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              {file ? (
                <>
                  <FileType className="mb-3" size={28} style={{ color: "hsl(var(--qm-accent))" }} />
                  <p className="text-[13px] font-semibold" style={{ color: "hsl(var(--qm-text))" }}>{file.name}</p>
                  <p className="text-[11px] mt-1" style={{ color: "hsl(var(--qm-text-muted))" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mb-3" size={28} style={{ color: "hsl(var(--qm-text-muted))" }} />
                  <p className="text-[13px] font-semibold" style={{ color: "hsl(var(--qm-text))" }}>Click or drag PDF here</p>
                  <p className="text-[11px] mt-1" style={{ color: "hsl(var(--qm-text-muted))" }}>Maximum file size 100MB</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium" style={{ color: "hsl(var(--qm-text-secondary))" }}>
              Title <span style={{ color: "hsl(var(--qm-text-muted))" }} className="text-[11px]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave blank to use filename"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="qm-input rounded-xl text-[13px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium" style={{ color: "hsl(var(--qm-text-secondary))" }}>
              Author <span style={{ color: "hsl(var(--qm-text-muted))" }} className="text-[11px]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="qm-input rounded-xl text-[13px]"
            />
          </div>

          <button
            type="submit"
            disabled={!file || isUploading}
            className="qm-btn w-full py-3 text-[13px] text-white mt-2"
            style={{
              background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
            }}
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {isUploading ? "Uploading & Processing..." : "Upload Book"}
          </button>
        </form>
      </div>
    </div>
  );
}
