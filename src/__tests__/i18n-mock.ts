import { createI18n } from 'vue-i18n'

export const i18nMock = createI18n({
  legacy: false,
  locale: 'es',
  messages: {
    es: {
      character: {
        status: {
          alive: 'Vivo',
          dead: 'Muerto',
          unknown: 'Desconocido',
        },
        species: 'Especie',
        gender: {
          gender: 'Género',
          male: 'Masculino',
          female: 'Femenino',
        },
        type: 'Tipo',
        origin: 'Origen',
        addToFavorites: 'Añadir a favoritos',
        removeFromFavorites: 'Eliminar de favoritos',
        inFavorites: 'En favoritos',
      },
      characterList: {
        title: 'Personajes',
        searchPlaceholder: 'Buscar personajes...',
        loading: 'Cargando...',
        error: 'Error al cargar los personajes',
        retry: 'Reintentar',
        previous: 'Anterior',
        next: 'Siguiente',
        pageInfo: 'Página {current} de {total}',
        noCharacters: 'No se encontraron personajes',
      },
      characterDetail: {
        backToList: 'Volver a la lista',
        loading: 'Cargando personaje...',
        error: 'Error al cargar el personaje',
        retry: 'Reintentar',
        basicInfo: 'Información básica',
        episodes: 'Episodios',
        origin: 'Origen',
        location: 'Ubicación actual',
        created: 'Creado',
      },
      favoriteCharacters: {
        title: 'Personajes favoritos',
        backToList: 'Volver a la lista',
        loading: 'Cargando favoritos...',
        error: 'Error al cargar los favoritos',
        retry: 'Reintentar',
        noFavorites: 'No hay favoritos',
        noFavoritesDescription: 'No tienes personajes favoritos guardados',
        charactersCount: '{count} personajes favoritos',
        confirmClearAll: '¿Estás seguro de que quieres eliminar todos los favoritos?',
        discoverCharacters: 'Descubre personajes',
      },
    },
  },
})
