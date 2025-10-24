<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFavoritesStore } from '@/stores/favorites'
import { CharacterService } from '@/services/CharacterService'
import type { Character } from '@/types/Character'
import type { Episode } from '@/types/Episode.ts'

const route = useRoute()
const favoritesStore = useFavoritesStore()
const character = ref<Character | null>(null)
const episodes = ref<Episode[]>([])
const loading = ref(false)
const error = ref(false)

const isFavorite = computed(() => {
  return character.value ? favoritesStore.isFavorite(character.value.id) : false
})

const formattedDate = computed(() => {
  if (!character.value) return ''
  return new Date(character.value.created).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const fetchCharacter = async () => {
  const id = Number(route.params.id)
  if (!id) return

  loading.value = true
  error.value = false

  try {
    character.value = await CharacterService.getCharacterById(id)

    // Obtener los episodios
    if (character.value.episode.length > 0) {
      const episodePromises = character.value.episode.map((url) =>
        fetch(url).then((res) => res.json()),
      )
      episodes.value = await Promise.all(episodePromises)
    }
  } catch (err) {
    console.error('Error fetching character:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const toggleFavorite = () => {
  if (character.value) {
    favoritesStore.toggleFavorite(character.value.id)
  }
}

onMounted(() => {
  fetchCharacter()
})
</script>

<template>
  <div class="character-detail">
    <div class="character-detail__header">
      <router-link to="/" class="back-button">
        ← {{ $t('characterDetail.backToList') }}
      </router-link>
      <div class="character-detail__title-section">
        <h1 class="character-detail__title">{{ character?.name }}</h1>
        <div class="character-detail__meta">
          <span
            class="character-detail__status"
            :class="`status-${character?.status.toLowerCase()}`"
          >
            {{ $t(`character.status.${character?.status.toLowerCase()}`) }}
          </span>
          <button
            v-if="character"
            @click="toggleFavorite"
            class="favorite-toggle"
            :class="{ 'favorite-toggle--active': isFavorite }"
          >
            {{ isFavorite ? '❤️' : '🤍' }}
            {{ isFavorite ? $t('character.inFavorites') : $t('character.addToFavorites') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="character-detail__loading">
      <div class="loading-spinner"></div>
      <p>{{ $t('characterDetail.loading') }}</p>
    </div>

    <div v-else-if="error" class="character-detail__error">
      <p>{{ $t('characterDetail.error') }}</p>
      <button @click="fetchCharacter" class="retry-btn">
        {{ $t('characterDetail.retry') }}
      </button>
    </div>

    <div v-else-if="character" class="character-detail__content">
      <div class="character-detail__main">
        <div class="character-detail__image-section">
          <img :src="character.image" :alt="character.name" class="character-detail__image" />
        </div>

        <div class="character-detail__info">
          <div class="info-section">
            <h3 class="info-section__title">{{ $t('characterDetail.basicInfo') }}</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-item__label">{{ $t('character.species') }}:</span>
                <span class="info-item__value">{{ character.species }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">{{ $t('character.gender') }}:</span>
                <span class="info-item__value">
                  {{ $t(`character.gender.${character.gender.toLowerCase()}`) }}
                </span>
              </div>
              <div class="info-item" v-if="character.type">
                <span class="info-item__label">{{ $t('character.type') }}:</span>
                <span class="info-item__value">{{ character.type }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">{{ $t('characterDetail.origin') }}:</span>
                <span class="info-item__value">{{ character.origin.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">{{ $t('characterDetail.location') }}:</span>
                <span class="info-item__value">{{ character.location.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-item__label">{{ $t('characterDetail.created') }}:</span>
                <span class="info-item__value">{{ formattedDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="character-detail__episodes">
        <h3 class="episodes-title">{{ $t('characterDetail.episodes') }} ({{ episodes.length }})</h3>
        <div class="episodes-grid">
          <div v-for="episode in episodes" :key="episode.id" class="episode-card">
            <div class="episode-card__code">{{ episode.episode }}</div>
            <h4 class="episode-card__name">{{ episode.name }}</h4>
            <div class="episode-card__meta">
              <span class="episode-card__date">{{ episode.air_date }}</span>
              <span class="episode-card__characters">
                {{ episode.characters.length }} characters
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.character-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
}

.character-detail__header {
  margin-bottom: $spacing-lg;
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

.character-detail__title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
}

.character-detail__title {
  color: $secondary-color;
  font-size: 2.5rem;
  margin: 0;
}

.character-detail__meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.character-detail__status {
  padding: $spacing-xs $spacing-sm;
  border-radius: 20px;
  font-size: 0.875rem;
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

.favorite-toggle {
  padding: $spacing-xs $spacing-sm;
  background: none;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: $accent-color;
    color: $accent-color;
  }

  &--active {
    border-color: $accent-color;
    background: $accent-color;
    color: white;

    &:hover {
      background: darken($accent-color, 10%);
      border-color: darken($accent-color, 10%);
    }
  }
}

.character-detail__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
}

.character-detail__main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: $spacing-lg;
  align-items: start;
}

.character-detail__image-section {
  position: sticky;
  top: $spacing-lg;
}

.character-detail__image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.character-detail__info {
  background: white;
  border-radius: 12px;
  padding: $spacing-lg;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-section__title {
  color: $secondary-color;
  font-size: 1.5rem;
  margin: 0 0 $spacing-md 0;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid #f1f5f9;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-sm 0;
  border-bottom: 1px solid #f8fafc;
}

.info-item__label {
  font-weight: 600;
  color: $text-color;
}

.info-item__value {
  color: #64748b;
  text-align: right;
}

.character-detail__episodes {
  background: white;
  border-radius: 12px;
  padding: $spacing-lg;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.episodes-title {
  color: $secondary-color;
  font-size: 1.5rem;
  margin: 0 0 $spacing-lg 0;
  padding-bottom: $spacing-sm;
  border-bottom: 2px solid #f1f5f9;
}

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: $spacing-md;
}

.episode-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: $spacing-md;
  border-left: 4px solid $primary-color;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.episode-card__code {
  font-family: monospace;
  font-weight: bold;
  color: $primary-color;
  font-size: 0.875rem;
  margin-bottom: $spacing-xs;
}

.episode-card__name {
  color: $secondary-color;
  font-size: 1.125rem;
  margin: 0 0 $spacing-xs 0;
  line-height: 1.4;
}

.episode-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #64748b;
}

.character-detail__loading,
.character-detail__error {
  text-align: center;
  padding: $spacing-xl;
  color: #64748b;
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
