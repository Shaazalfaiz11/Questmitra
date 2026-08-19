"use client";

import React, { useState, useEffect } from "react";
import BookCard from "../../components/library/BookCard";
import UploadBookModal from "../../components/library/UploadBookModal";
import { Search, BookOpen, Loader2, Upload, Heart } from "lucide-react";
import axios from "axios";
import { API_URL } from "../lib/api";

function getFavorites(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("questmitra_favorites") || "[]");
  } catch { return []; }
}

export default function LibraryPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [favorites, setFavorites] = useState<any[]>([]);

  const fetchBooks = async (query = "") => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/books${query ? `?query=${encodeURIComponent(query)}` : ""}`);
      setBooks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch books", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFavorites = () => {
    setFavorites(getFavorites());
  };

  useEffect(() => {
    fetchBooks();
    refreshFavorites();
  }, []);

  useEffect(() => {
    if (activeTab === "favorites") refreshFavorites();
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(searchQuery);
  };

  const displayBooks = activeTab === "favorites" ? favorites : books;

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--qm-bg))" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-[26px] font-extrabold tracking-tight flex items-center gap-3"
              style={{ color: "hsl(var(--qm-text))" }}
            >
              <BookOpen style={{ color: "hsl(var(--qm-accent))" }} size={28} />
              Library
            </h1>
            <p className="mt-1.5 text-[13px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>
              Discover and read books from your collection and the web.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="relative group w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search library or Google Books..."
                className="qm-input pl-10 pr-4 py-2.5 text-[13px] rounded-xl"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
                size={16}
                style={{ color: "hsl(var(--qm-text-muted))" }}
              />
            </form>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="qm-btn text-[13px] text-white whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, hsl(245 58% 51%), hsl(270 60% 55%))",
                boxShadow: "0 4px 14px hsla(245, 58%, 51%, 0.3)",
              }}
            >
              <Upload size={16} />
              Upload PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`qm-btn text-[13px] px-4 py-2 ${
              activeTab === "all"
                ? "text-white"
                : "qm-btn-secondary"
            }`}
            style={activeTab === "all" ? { background: "hsl(var(--qm-accent))" } : undefined}
          >
            <BookOpen size={15} />
            All Books
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`qm-btn text-[13px] px-4 py-2 ${
              activeTab === "favorites"
                ? "text-white"
                : "qm-btn-secondary"
            }`}
            style={activeTab === "favorites" ? { background: "hsl(var(--qm-error))" } : undefined}
          >
            <Heart size={15} />
            Favorites
            {favorites.length > 0 && (
              <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === "favorites" ? "bg-white/20" : ""
              }`}
                style={activeTab !== "favorites" ? { background: "hsl(var(--qm-error-light))", color: "hsl(var(--qm-error))" } : undefined}
              >
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "all" && isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin mb-4" size={36} style={{ color: "hsl(var(--qm-accent))" }} />
            <p className="text-[13px] font-medium" style={{ color: "hsl(var(--qm-text-muted))" }}>Loading library...</p>
          </div>
        ) : displayBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {displayBooks.map((book) => (
              <BookCard
                key={book._id || book.id}
                id={book._id || book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                source={book.source}
                totalPages={book.totalPages}
              />
            ))}
          </div>
        ) : (
          <div className="text-center qm-card p-12 mt-4 qm-slide-up">
            {activeTab === "favorites" ? (
              <>
                <Heart className="mx-auto mb-4" size={56} style={{ color: "hsl(var(--qm-border))" }} />
                <h3 className="text-[17px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>No favorites yet</h3>
                <p className="text-[13px] max-w-sm mx-auto mb-6" style={{ color: "hsl(var(--qm-text-muted))" }}>
                  Tap the ❤️ heart on any book to save it here for quick access.
                </p>
                <button onClick={() => setActiveTab("all")} className="qm-btn qm-btn-primary text-[13px]">
                  <BookOpen size={16} />
                  Browse Library
                </button>
              </>
            ) : (
              <>
                <BookOpen className="mx-auto mb-4" size={56} style={{ color: "hsl(var(--qm-border))" }} />
                <h3 className="text-[17px] font-bold mb-2" style={{ color: "hsl(var(--qm-text))" }}>No books found</h3>
                <p className="text-[13px] max-w-sm mx-auto mb-6" style={{ color: "hsl(var(--qm-text-muted))" }}>
                  Try adjusting your search query or upload a new book to your collection.
                </p>
                <button onClick={() => setUploadModalOpen(true)} className="qm-btn qm-btn-primary text-[13px]">
                  <Upload size={16} />
                  Upload Your First Book
                </button>
              </>
            )}
          </div>
        )}

      </div>

      <UploadBookModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => fetchBooks()}
      />
    </div>
  );
}
