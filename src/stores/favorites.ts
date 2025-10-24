import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const FAVORITES_STORAGE_KEY = 'rick-and-morty-favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref<Set<number>>(new Set())

  const favoriteIdsArray = computed(() => Array.from(favoriteIds.value))

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const idsArray = JSON.parse(stored) as number[]
        favoriteIds.value = new Set(idsArray)
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
      favoriteIds.value = new Set()
    }
  }

  const saveFavorites = () => {
    try {
      const idsArray = favoriteIdsArray.value
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(idsArray))
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error)
    }
  }

  const addToFavorites = (characterId: number) => {
    favoriteIds.value.add(characterId)
    saveFavorites()
  }

  const removeFromFavorites = (characterId: number) => {
    favoriteIds.value.delete(characterId)
    saveFavorites()
  }

  const isFavorite = (characterId: number) => {
    return favoriteIds.value.has(characterId)
  }

  const toggleFavorite = (characterId: number) => {
    if (isFavorite(characterId)) {
      removeFromFavorites(characterId)
    } else {
      addToFavorites(characterId)
    }
  }

  const favoritesCount = computed(() => favoriteIds.value.size)

  const clearFavorites = () => {
    favoriteIds.value.clear()
    saveFavorites()
  }

  loadFavorites()

  return {
    favoriteIds,
    favoriteIdsArray,
    favoritesCount,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    loadFavorites,
  }
})
