import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useFavoritesStore } from '@/stores/favorites'

describe('useFavorites', () => {
  const STORAGE_KEY = 'rick-and-morty-favorites'
  let localStorageMock: { [key: string]: string }

  beforeEach(() => {
    localStorageMock = {}

    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key]
      }),
      clear: vi.fn(() => {
        localStorageMock = {}
      }),
      key: vi.fn((index: number) => Object.keys(localStorageMock)[index] || null),
      length: 0,
    } as Storage

    setActivePinia(createPinia())
  })

  it('proporciona acceso a los IDs de favoritos', () => {
    const store = useFavoritesStore()
    const testIds = [1, 2, 3]
    testIds.forEach((id) => store.addToFavorites(id))

    expect(store.favoriteIds).toBeInstanceOf(Set)
    expect(Array.isArray(store.favoriteIdsArray)).toBe(true)
    expect(store.favoriteIdsArray).toEqual(testIds)
  })

  it('permite añadir favoritos', () => {
    const store = useFavoritesStore()
    store.addToFavorites(1)
    expect(store.isFavorite(1)).toBe(true)
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([1]))
  })

  it('permite eliminar favoritos', () => {
    const store = useFavoritesStore()
    store.addToFavorites(1)
    store.removeFromFavorites(1)
    expect(store.isFavorite(1)).toBe(false)
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([]))
  })

  it('permite alternar el estado de favorito', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(1)
    expect(store.isFavorite(1)).toBe(true)
    store.toggleFavorite(1)
    expect(store.isFavorite(1)).toBe(false)
  })

  it('proporciona el conteo correcto de favoritos', () => {
    const store = useFavoritesStore()
    expect(store.favoritesCount).toBe(0)
    store.addToFavorites(1)
    store.addToFavorites(2)
    expect(store.favoritesCount).toBe(2)
  })

  it('permite limpiar todos los favoritos', () => {
    const store = useFavoritesStore()
    store.addToFavorites(1)
    store.addToFavorites(2)
    store.clearFavorites()
    expect(store.favoritesCount).toBe(0)
    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([]))
  })

  describe('persistencia', () => {
    it('guarda los favoritos en localStorage', () => {
      const store = useFavoritesStore()
      store.addToFavorites(1)
      expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([1]))
    })

    it('carga los favoritos desde localStorage al inicializar', () => {
      localStorageMock[STORAGE_KEY] = JSON.stringify([1, 2])
      const store = useFavoritesStore()
      expect(store.isFavorite(1)).toBe(true)
      expect(store.isFavorite(2)).toBe(true)
    })

    it('carga favoritos desde localStorage al iniciar', () => {
      const initialFavorites = [1, 2, 3]
      localStorageMock[STORAGE_KEY] = JSON.stringify(initialFavorites)

      const store = useFavoritesStore()
      expect(store.favoriteIdsArray).toEqual(initialFavorites)
    })

    it('maneja correctamente datos inválidos en localStorage', () => {
      localStorageMock[STORAGE_KEY] = 'invalid json'

      const store = useFavoritesStore()
      expect(store.favoriteIdsArray).toEqual([])
    })
  })

  describe('casos límite', () => {
    it('maneja intentos de agregar IDs duplicados', () => {
      const store = useFavoritesStore()
      store.addToFavorites(1)
      store.addToFavorites(1)
      expect(store.favoritesCount).toBe(1)
      expect(store.favoriteIdsArray).toEqual([1])
    })

    it('maneja intentos de eliminar IDs inexistentes', () => {
      const store = useFavoritesStore()
      store.removeFromFavorites(999)
      expect(store.favoritesCount).toBe(0)
    })

    it('mantiene el estado después de recargar', () => {
      const store = useFavoritesStore()
      store.addToFavorites(1)
      store.addToFavorites(2)

      // Simular recarga creando una nueva instancia del store
      const newStore = useFavoritesStore()
      expect(newStore.favoriteIdsArray).toEqual([1, 2])
    })
  })
})
