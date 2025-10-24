<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { debounce } from 'lodash-es'
import type { Character } from '@/types/Character'
import { CharacterService } from '@/services/CharacterService'
import { useFavorites } from '@/composables/useFavorites'
import CharacterCard from './CharacterCard.vue'
import type { ApiResponse } from '@/types/ApiResponse.ts'

const characters = ref<Character[]>([])
const loading = ref(false)
const error = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pagination = ref({
  count: 0,
  pages: 0,
  next: null as string | null,
  prev: null as string | null,
})

const { isFavorite, toggleFavorite, clearFavorites, favoritesCount } = useFavorites()

const fetchCharacters = async (page: number = 1) => {
  loading.value = true
  error.value = false

  try {
    let response: ApiResponse

    if (searchQuery.value.trim()) {
      response = await CharacterService.getCharactersByName(searchQuery.value, page)
    } else {
      response = await CharacterService.getCharacters(page)
    }

    characters.value = response.results
    pagination.value = response.info
    currentPage.value = page
  } catch (err) {
    console.error('Error fetching characters:', err)
    error.value = true
    characters.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = debounce(() => {
  currentPage.value = 1
  fetchCharacters(1)
}, 300)

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.pages) {
    fetchCharacters(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const clearAllFavorites = () => {
  if (confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
    clearFavorites()
  }
}

onMounted(() => {
  fetchCharacters()
})
</script>

<template>
  <div class="character-list">
    <div class="character-list__header">
      <div class="character-list__title-section">
        <h1 class="character-list__title">
          {{ $t('characterList.title') }}
        </h1>
      </div>

      <div class="character-list__controls">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('characterList.searchPlaceholder')"
            class="search-box__input"
            @input="handleSearch"
          />
          <span class="search-box__icon">🔍</span>
        </div>

        <button
          v-if="favoritesCount > 0"
          @click="clearAllFavorites"
          class="clear-favorites-btn"
          :title="$t('characterList.clearAllFavorites')"
        >
          🗑️ {{ $t('characterList.clearAll') }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="character-list__loading">
      <div class="loading-spinner"></div>
      <p>{{ $t('characterList.loading') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="character-list__error">
      <p>{{ $t('characterList.error') }}</p>
      <button @click="fetchCharacters" class="retry-btn">
        {{ $t('characterList.retry') }}
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="characters.length === 0" class="character-list__empty">
      <p>{{ $t('characterList.noCharacters') }}</p>
    </div>

    <!-- Characters Grid -->
    <div v-else class="character-list__grid">
      <CharacterCard
        v-for="character in characters"
        :key="character.id"
        :character="character"
        :is-favorite="isFavorite(character.id)"
        @toggle-favorite="toggleFavorite(character.id)"
      />
    </div>

    <!-- Pagination -->
    <div v-if="!loading && characters.length > 0" class="character-list__pagination">
      <button
        :disabled="!pagination.prev"
        @click="changePage(currentPage - 1)"
        class="pagination-btn"
        :class="{ 'pagination-btn--disabled': !pagination.prev }"
      >
        {{ $t('characterList.previous') }}
      </button>

      <span class="character-list__page-info">
        {{ $t('characterList.pageInfo', { current: currentPage, total: pagination.pages }) }}
      </span>

      <button
        :disabled="!pagination.next"
        @click="changePage(currentPage + 1)"
        class="pagination-btn"
        :class="{ 'pagination-btn--disabled': !pagination.next }"
      >
        {{ $t('characterList.next') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.character-list {
  max-width: 1200px;
  margin: 0 auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  &__title {
    color: $secondary-color;
    font-size: 2rem;
    margin: 0;
  }

  &__controls {
    display: flex;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  &__loading,
  &__error,
  &__empty {
    text-align: center;
    color: #64748b;
  }

  &__pagination {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__page-info {
    color: $text-color;
    font-weight: 600;
  }
}

.search-box {
  position: relative;
  min-width: 300px;

  &__input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  &__icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-left: 4px solid $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.retry-btn,
.pagination-btn {
  padding: 0.75rem 1.5rem;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &--disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
}

.retry-btn {
  background: $accent-color;
}
</style>
