<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Character } from '@/types/Character';
import { CharacterService } from '@/services/CharacterService';
import CharacterCard from './CharacterCard.vue';
import type { ApiResponse } from '@/types/ApiResponse.ts'

const characters = ref<Character[]>([]);
const loading = ref(false);
const error = ref(false);

// Methods
const fetchCharacters = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response: ApiResponse = await CharacterService.getCharacters();

    characters.value = response.results;
  } catch (err) {
    console.error('Error fetching characters:', err);
    error.value = true;
    characters.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCharacters();
});
</script>

<template>
  <div class="character-list">
    <div class="character-list__header">
      <h1 class="character-list__title">
        {{ $t('characterList.title') }}
      </h1>
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
      />
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

.retry-btn {
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
