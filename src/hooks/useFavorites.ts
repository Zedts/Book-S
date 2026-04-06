import { useFavoritesContext } from "@/src/components/layout/FavoritesProvider";

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesContext();
  return { favorites, toggleFavorite, isFavorite };
}
