import { useState, useMemo } from "react";
import type { Book } from "@/src/types/landing";

export function useBookFilters(initialBooks: Book[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      const searchString = searchQuery.toLowerCase();
      const matchSearch =
        book.title.toLowerCase().includes(searchString) ||
        book.author.toLowerCase().includes(searchString) ||
        (book.category?.name || "").toLowerCase().includes(searchString);

      const matchCategory =
        activeCategory === "all" || book.category?.id === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [initialBooks, searchQuery, activeCategory]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filteredBooks,
  };
}
