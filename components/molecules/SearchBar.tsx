"use client";

import { useState, useEffect } from "react";
import type { ThemeColors } from "@/lib/themes";

interface SearchBarProps {
  colors: ThemeColors;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ colors, onSearch, debounceMs = 300 }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, debounceMs]);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search posts by title or content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 pl-10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${colors.inputFocusBorder} ${colors.inputFocusRing}`}
      />
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          aria-label="Clear search"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

