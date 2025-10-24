import { useFavoritesStore } from '@/stores/favorites'

export function useFavorites() {
  const favoritesStore = useFavoritesStore()

  return {
    favoriteIds: favoritesStore.favoriteIds,
    favoriteIdsArray: favoritesStore.favoriteIdsArray,
    favoritesCount: favoritesStore.favoritesCount,

    addToFavorites: favoritesStore.addToFavorites,
    removeFromFavorites: favoritesStore.removeFromFavorites,
    isFavorite: favoritesStore.isFavorite,
    toggleFavorite: favoritesStore.toggleFavorite,
    clearFavorites: favoritesStore.clearFavorites,
    loadFavorites: favoritesStore.loadFavorites
  }
}
