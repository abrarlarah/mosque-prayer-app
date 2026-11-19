"use client";

import React, { useState, useMemo } from "react";
import MosqueCard from "@/components/public/mosque-card";
import type { Mosque } from "@/types/mosque";
import {
  getPrayerTimes,
  getDistricts,
  getTownsByDistrict,
  filterMosques,
} from "@/lib/sample-data";
import {
  Building2,
  Search,
  Filter,
  X,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

interface MosqueListingSectionProps {
  initialMosques: Mosque[];
  title?: string;
  subtitle?: string;
}

export default function MosqueListingSection({
  initialMosques,
  title = "Explore Mosques by District & Town",
  subtitle = "Filter mosques by district, town/area, or search by name to view today's complete 5 prayer times.",
}: MosqueListingSectionProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedTown, setSelectedTown] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // All available districts
  const districts = useMemo(() => getDistricts(), []);

  // Towns filtered by selected district
  const availableTowns = useMemo(() => {
    return getTownsByDistrict(selectedDistrict === "all" ? "" : selectedDistrict);
  }, [selectedDistrict]);

  // Handle District change (resets town)
  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    setSelectedTown("all");
  };

  // Filtered mosques
  const filteredMosques = useMemo(() => {
    return filterMosques({
      district: selectedDistrict,
      town: selectedTown,
      query: searchQuery,
    });
  }, [selectedDistrict, selectedTown, searchQuery]);

  const hasActiveFilters =
    selectedDistrict !== "all" || selectedTown !== "all" || searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedDistrict("all");
    setSelectedTown("all");
    setSearchQuery("");
  };

  return (
    <section id="mosques-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>

      {/* FILTER BAR: District -> Town -> Search */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary pb-2 border-b border-border/80">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter by Location &amp; Name</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          {/* 1. First: District Filter */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Step 1: Select District</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All Districts (Whole J&amp;K)</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  District {d}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Then: Town / Area Filter */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-accent" />
              <span>Step 2: Select Town / Area</span>
            </label>
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              disabled={availableTowns.length === 0}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              <option value="all">
                {selectedDistrict === "all"
                  ? "All Towns & Areas"
                  : `All Towns in ${selectedDistrict}`}
              </option>
              {availableTowns.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Search Bar by Name / Street */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Search Mosque by Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Jamia Bilal, Noor, Hanfia..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Pills & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/80 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-muted-foreground">Active Filters:</span>
              {selectedDistrict !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  District: {selectedDistrict}
                  <button
                    onClick={() => handleDistrictChange("all")}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTown !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground font-medium">
                  Town: {selectedTown}
                  <button
                    onClick={() => setSelectedTown("all")}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-foreground font-medium">
                  Keyword: &ldquo;{searchQuery}&rdquo;
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-border text-sm text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredMosques.length}</strong> {filteredMosques.length === 1 ? "mosque" : "mosques"} with complete 5 prayer schedules
        </span>
      </div>

      {/* Mosque Cards Grid */}
      {filteredMosques.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMosques.map((mosque) => {
            const prayers = getPrayerTimes(mosque.id);
            return (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                prayerTimes={prayers}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-muted/30 rounded-2xl border border-dashed border-border max-w-xl mx-auto">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-1">
            No mosques found
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            We couldn&apos;t find any mosques matching your chosen district, town, or search query.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
          >
            Show All Mosques
          </button>
        </div>
      )}
    </section>
  );
}
