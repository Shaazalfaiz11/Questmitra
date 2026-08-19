"use client"

import React, { useEffect, useState, use } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { API_URL } from "../../lib/api";

const Reader = dynamic(() => import("../../../components/library/Reader"), { ssr: false });

export default function BookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/books/${id}`);
        setBook(res.data.data);
      } catch (error) {
        console.error("Failed to fetch book", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: "hsl(var(--qm-bg))" }}
      >
        <Loader2 className="animate-spin" size={40} style={{ color: "hsl(var(--qm-accent))" }} />
        <p className="text-[13px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>Loading book...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "hsl(var(--qm-bg))" }}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "hsl(var(--qm-error-light))" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--qm-error))" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-[18px] font-bold" style={{ color: "hsl(var(--qm-text))" }}>Book not found</h2>
        <Link href="/library" className="qm-btn qm-btn-primary text-[13px]">
          ← Back to Library
        </Link>
      </div>
    );
  }

  return (
    <Reader
      bookId={book._id}
      totalPages={book.totalPages === 0 ? 10 : book.totalPages}
      title={book.title}
      author={book.author}
      coverImage={book.coverImage}
      description={book.description}
      source={book.source}
    />
  );
}
