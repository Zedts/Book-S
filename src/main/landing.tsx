"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Book, Category } from "@/src/types/landing";
import GuestLayout from "@/src/components/layout/GuestLayout";
import { useBookFilters } from "@/src/hooks/useBookFilters";

// Sub-components
import { HeroSection } from "../components/landing/HeroSection";
import { CategoriesSection } from "../components/landing/CategoriesSection";
import { BestSellersSection } from "../components/landing/BestSellersSection";
import { NewsletterSection } from "../components/landing/NewsletterSection";

export default function Landing({
  initialCategories,
  initialBooks
}: {
  initialCategories: Category[];
  initialBooks: Book[];
}) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [categories] = useState<Category[]>([
    { id: "all", name: "Semua Kategori", slug: "all" },
    ...initialCategories
  ]);
  
  const featuredBooks = initialBooks.filter(b => b.isFeatured).slice(0, 4);
  
  const { 
    searchQuery, 
    setSearchQuery, 
    activeCategory, 
    setActiveCategory, 
    filteredBooks 
  } = useBookFilters(initialBooks);

  // Initialize search from query params
  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch, setSearchQuery]);

  // Syncing search query from Navbar by listening to a custom event
  useEffect(() => {
    const handleSearchEvent = (e: CustomEvent) => {
      setSearchQuery(e.detail?.query || "");
      document.getElementById("koleksi")?.scrollIntoView({ behavior: "smooth" });
    };
    
    window.addEventListener("navbar-search", handleSearchEvent as EventListener);
    return () => window.removeEventListener("navbar-search", handleSearchEvent as EventListener);
  }, [setSearchQuery]);

  return (
    <GuestLayout>
      <HeroSection books={featuredBooks} />
      <CategoriesSection 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />
      <BestSellersSection 
        books={filteredBooks} 
        searchQuery={searchQuery} 
      />
      <NewsletterSection />
    </GuestLayout>
  );
}
