<script setup lang="ts">
import type { Character } from '@/types/Character';

interface Props {
  character: Character;
  isFavorite: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggleFavorite: [characterId: number];
}>();

const toggleFavorite = () => {
  emit('toggleFavorite', props.character.id);
};
</script>

<template>
  <div class="character-card" :class="{ 'character-card--favorite': isFavorite }">
    <div class="character-card__image-container">
      <img
        :src="character.image"
        :alt="character.name"
        class="character-card__image"
        loading="lazy"
      />
      <div class="character-card__status">
        {{ $t(`character.status.${character.status.toLowerCase()}`) }}
      </div>
    </div>

    <div class="character-card__content">
      <h3 class="character-card__name">{{ character.name }}</h3>

      <div class="character-card__details">
        <div class="character-card__detail">
          <span class="character-card__label">
            {{ $t('character.species') }}:
          </span>
          <span class="character-card__value">{{ character.species }}</span>
        </div>

        <div class="character-card__detail">
          <span class="character-card__label">
            {{ $t('character.gender.gender') }}:
          </span>
          <span class="character-card__value">
            {{ $t(`character.gender.${character.gender.toLowerCase()}`) }}
          </span>
        </div>

        <div class="character-card__detail" v-if="character.type">
          <span class="character-card__label">
            {{ $t('character.type') }}:
          </span>
          <span class="character-card__value">{{ character.type }}</span>
        </div>

        <div class="character-card__detail">
          <span class="character-card__label">
            {{ $t('character.origin') }}:
          </span>
          <span class="character-card__value">{{ character.origin.name }}</span>
        </div>
      </div>

      <button
        @click="toggleFavorite"
        class="character-card__favorite-btn"
        :class="{ 'character-card__favorite-btn--active': isFavorite }"
        :aria-label="isFavorite ? $t('character.removeFromFavorites') : $t('character.addToFavorites')"
      >
        <span class="character-card__favorite-icon">❤</span>
        {{ isFavorite ? $t('character.inFavorites') : $t('character.addToFavorites') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.character-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }

  &--favorite {
    border-color: $accent-color;
  }

  &__image-container {
    position: relative;
  }

  &__image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    display: block;
  }

  &__status {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    color: white;

    &.status-alive {
      background-color: #10b981;
    }

    &.status-dead {
      background-color: #ef4444;
    }

    &.status-unknown {
      background-color: #6b7280;
    }
  }

  &__name {
    font-size: 1.25rem;
    font-weight: bold;
    color: $secondary-color;
    line-height: 1.3;
  }

  &__details {
    space-y: 0.5rem;
  }

  &__detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
    border-bottom: 1px solid #f1f5f9;
  }

  &__label {
    font-weight: 600;
    color: $text-color;
    font-size: 0.875rem;
  }

  &__value {
    color: #64748b;
    font-size: 0.875rem;
    text-align: right;
  }

  &__favorite-btn {
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    color: #64748b;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover {
      border-color: $accent-color;
      color: $accent-color;
      background: rgba(255, 107, 107, 0.05);
    }

    &--active {
      border-color: $accent-color;
      background: $accent-color;
      color: white;
    }
  }

  &__favorite-icon {
    font-size: 1.125rem;
  }
}
</style>
