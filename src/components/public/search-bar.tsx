"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search mosques by name, city, or area...",
  defaultValue = "",
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [value, onSearch]);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <div className="relative flex items-center">
        <Search
          className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none transition-colors"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "w-full h-12 sm:h-14 pl-12 pr-12 text-base sm:text-lg",
            "bg-card text-foreground placeholder:text-muted-foreground/70",
            "border border-border/80 rounded-full shadow-sm",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "hover:border-border",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 sm:right-3.5 flex items-center justify-center h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
