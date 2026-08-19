"use client"

import React, { useState, useEffect } from "react";
import { Book as BookIcon, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  source: string;
  totalPages: number;
}

function getFavorites(): any[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("questmitra_favorites") || "[]");
  } catch { return []; }
}

function setFavorites(favs: any[]) {
  localStorage.setItem("questmitra_favorites", JSON.stringify(favs));
}

export default function BookCard({ id, title, author, coverImage, source, totalPages }: BookCardProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().some((b: any) => b.id === id));
  }, [id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favs = getFavorites();
    if (isFav) {
      setFavorites(favs.filter((b: any) => b.id !== id));
      setIsFav(false);
    } else {
      setFavorites([...favs, { id, title, author, coverImage, source, totalPages }]);
      setIsFav(true);
    }
  };

  return (
    <div
      onClick={() => router.push(`/library/${id}`)}
      className="qm-card qm-card-interactive p-4 cursor-pointer group flex flex-col h-full relative"
    >
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-4 flex-shrink-0"
        style={{ background: "hsl(var(--qm-bg-subtle))" }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ color: "hsl(var(--qm-border))" }}>
            <BookIcon size={48} className="opacity-40" />
          </div>
        )}
        <div className="absolute top-2 right-2 backdrop-blur-md text-white px-2 py-1 rounded-md text-[10px] font-semibold"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          {source === "upload" ? "PDF" : "API"}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-[14px] line-clamp-2 leading-tight mb-1 pr-8"
          style={{ color: "hsl(var(--qm-text))" }}
        >
          {title}
        </h3>
        <p className="text-[12px] line-clamp-1" style={{ color: "hsl(var(--qm-text-muted))" }}>{author}</p>

        <div className="mt-auto pt-4 flex items-center justify-between text-[11px] font-medium"
          style={{ color: "hsl(var(--qm-text-muted))" }}
        >
          <span>{totalPages} Pages</span>
        </div>
      </div>

      {/* Favorite heart */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-6 left-6 p-1.5 rounded-full backdrop-blur-md transition-all z-10 ${
          isFav
            ? "text-white"
            : "hover:text-red-400"
        }`}
        style={{
          background: isFav ? "hsl(var(--qm-error))" : "rgba(255,255,255,0.8)",
          color: isFav ? "white" : "hsl(var(--qm-text-muted))",
          boxShadow: isFav ? "0 2px 8px hsla(0, 72%, 51%, 0.25)" : undefined,
        }}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
