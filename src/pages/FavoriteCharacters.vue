<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'
import { CharacterService } from '@/services/CharacterService'
import type { Character } from '@/types/Character'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const favoritesStore = useFavoritesStore()
const favoriteCharacters = ref<Character[]>([])
const loading = ref(false)
const error = ref(false)

const favoritesCount = favoritesStore.favoritesCount

const fetchFavoriteCharacters = async () => {
  if (favoritesStore.favoriteIdsArray.length === 0) {
    favoriteCharacters.value = []
    return
  }

  loading.value = true
  error.value = false

  try {
    const promises = favoritesStore.favoriteIdsArray.map((id) =>
      CharacterService.getCharacterById(id),
    )

    favoriteCharacters.value = await Promise.all(promises)
  } catch (err) {
    console.error('Error fetching favorite characters:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const removeFromFavorites = (characterId: number) => {
  favoritesStore.removeFromFavorites(characterId)
  favoriteCharacters.value = favoriteCharacters.value.filter(
    (character) => character.id !== characterId,
  )
}

const clearAllFavorites = () => {
  if (confirm(t('favoriteCharacters.confirmClearAll'))) {
    favoritesStore.clearFavorites()
    favoriteCharacters.value = []
  }
}

// Watcher para cambios en los favoritos
watch(
  () => favoritesStore.favoriteIdsArray,
  (newIds) => {
    if (newIds.length === 0) {
      favoriteCharacters.value = []
    } else {
      // Si hay cambios, volvemos a cargar (podría optimizarse)
      fetchFavoriteCharacters()
    }
  },
)

onMounted(() => {
  fetchFavoriteCharacters()
})
</script>

<template>
  <div class="favorite-characters">
    <div class="favorite-characters__header">
      <router-link to="/" class="back-button">
        ← {{ $t('favoriteCharacters.backToList') }}
      </router-link>
      <h1 class="favorite-characters__title">
        {{ $t('favoriteCharacters.title') }}
      </h1>
      <div class="favorite-characters__count">
        {{ $t('favoriteCharacters.charactersCount', { count: favoritesCount }) }}
      </div>
    </div>

    <div v-if="loading" class="favorite-characters__loading">
      <div class="loading-spinner"></div>
      <p>{{ $t('favoriteCharacters.loading') }}</p>
    </div>

    <div v-else-if="error" class="favorite-characters__error">
      <p>{{ $t('favoriteCharacters.error') }}</p>
      <button @click="fetchFavoriteCharacters" class="retry-btn">
        {{ $t('favoriteCharacters.retry') }}
      </button>
    </div>

    <div v-else-if="favoritesCount === 0" class="favorite-characters__empty">
      <div class="empty-state">
        <span class="empty-state__icon">❤️</span>
        <h3>{{ $t('favoriteCharacters.noFavorites') }}</h3>
        <p>{{ $t('favoriteCharacters.noFavoritesDescription') }}</p>
        <router-link to="/" class="discover-button">
          {{ $t('favoriteCharacters.discoverCharacters') }}
        </router-link>
      </div>
    </div>

    <div v-else class="favorite-characters__grid">
      <div
        v-for="character in favoriteCharacters"
        :key="character.id"
        class="favorite-character-card"
      >
        <div class="favorite-character-card__image-container">
          <router-link
            :to="`/character/${character.id}`"
            class="favorite-character-card__image-link"
          >
            <img
              :src="character.image"
              :alt="character.name"
              class="favorite-character-card__image"
            />
          </router-link>
          <div
            class="favorite-character-card__status"
            :class="`status-${character.status.toLowerCase()}`"
          >
            {{ $t(`character.status.${character.status.toLowerCase()}`) }}
          </div>
        </div>

        <div class="favorite-character-card__content">
          <h3 class="favorite-character-card__name">
            <router-link :to="`/character/${character.id}`" class="character-link">
              {{ character.name }}
            </router-link>
          </h3>

          <div class="favorite-character-card__details">
            <div class="favorite-character-card__detail">
              <span class="favorite-character-card__label"> {{ $t('character.species') }}: </span>
              <span class="favorite-character-card__value">{{ character.species }}</span>
            </div>

            <div class="favorite-character-card__detail">
              <span class="favorite-character-card__label">
                {{ $t('character.gender.gender') }}:
              </span>
              <span class="favorite-character-card__value">
                {{ $t(`character.gender.${character.gender.toLowerCase()}`) }}
              </span>
            </div>

            <div class="favorite-character-card__detail" v-if="character.type">
              <span class="favorite-character-card__label"> {{ $t('character.type') }}: </span>
              <span class="favorite-character-card__value">{{ character.type }}</span>
            </div>
          </div>

          <button
            @click="removeFromFavorites(character.id)"
            class="favorite-character-card__remove-btn"
            :title="$t('favoriteCharacters.removeFromFavorites')"
          >
            🗑️ {{ $t('favoriteCharacters.remove') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="favoritesCount > 0" class="favorite-characters__actions">
      <button @click="clearAllFavorites" class="clear-all-btn">
        🗑️ {{ $t('favoriteCharacters.clearAll') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.favorite-characters {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
}

.favorite-characters__header {
  margin-bottom: $spacing-lg;
  text-align: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  color: $primary-color;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: $spacing-md;

  &:hover {
    text-decoration: underline;
  }
}

.favorite-characters__title {
  color: $secondary-color;
  font-size: 2.5rem;
  margin: 0 0 $spacing-xs 0;
}

.favorite-characters__count {
  color: $text-color;
  font-size: 1.125rem;
  opacity: 0.8;
}

.favorite-characters__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.favorite-character-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
}

.favorite-character-card__image-container {
  position: relative;
  flex: 0 0 120px;
}

.favorite-character-card__image-link {
  display: block;
  height: 100%;
  cursor: pointer;
}

.favorite-character-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.favorite-character-card__image-link:hover .favorite-character-card__image {
  transform: scale(1.05);
}

.favorite-character-card__status {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 6px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}

.status-alive {
  background-color: #10b981;
}

.status-dead {
  background-color: #ef4444;
}

.status-unknown {
  background-color: #6b7280;
}

.favorite-character-card__content {
  flex: 1;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
}

.favorite-character-card__name {
  margin: 0 0 $spacing-sm 0;
  font-size: 1.125rem;
}

.character-link {
  color: $secondary-color;
  text-decoration: none;

  &:hover {
    color: $primary-color;
    text-decoration: underline;
  }
}

.favorite-character-card__details {
  flex: 1;
  margin-bottom: $spacing-sm;
}

.favorite-character-card__detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.favorite-character-card__label {
  font-weight: 600;
  color: $text-color;
  font-size: 0.875rem;
}

.favorite-character-card__value {
  color: #64748b;
  font-size: 0.875rem;
  text-align: right;
}

.favorite-character-card__remove-btn {
  padding: 0.5rem $spacing-sm;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #dc2626;
  }
}

.favorite-characters__loading,
.favorite-characters__error,
.favorite-characters__empty {
  text-align: center;
  padding: $spacing-xl;
  color: #64748b;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-state__icon {
  font-size: 4rem;
  display: block;
  margin-bottom: $spacing-md;
}

.favorite-characters__actions {
  text-align: center;
}

.clear-all-btn {
  padding: $spacing-sm $spacing-lg;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #dc2626;
  }
}

.retry-btn {
  padding: $spacing-sm $spacing-lg;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: $spacing-md;

  &:hover {
    background: darken($primary-color, 10%);
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-left: 4px solid $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto $spacing-sm;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
