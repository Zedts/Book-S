"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getFavorites, toggleFavoriteAction } from "@/src/lib/actions/favorite";

type FavoritesContextType = {
  favorites: string[];
  toggleFavorite: (bookId: string) => Promise<void>;
  isFavorite: (bookId: string) => boolean;
  isLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: async () => {},
  isFavorite: () => false,
  isLoading: true,
});

export function FavoritesProvider({ children, isAuthenticated }: { children: React.ReactNode, isAuthenticated: boolean }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Failed to load favorites", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (bookId: string) => {
    if (!isAuthenticated) {
      localStorage.setItem("pending_favorite", bookId);
      window.location.href = '/auth';
      return;
    }

    // Optimistic UI update
    setFavorites((prev) => 
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );

    try {
      await toggleFavoriteAction(bookId);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
      // Revert on error
      setFavorites((prev) => 
        prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
      );
    }
  }, [isAuthenticated]);

  const isFavorite = useCallback((bookId: string) => {
    return favorites.includes(bookId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
