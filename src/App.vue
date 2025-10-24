<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()
const favoritesCount = computed(() => favoritesStore.favoritesCount)
</script>

<template>
  <div id="app">
    <nav class="app-nav">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">
          🪐 Rick and Morty App
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">
            {{ $t('navigation.characters') }}
          </router-link>
          <router-link to="/favorites" class="nav-link favorites-link">
            ❤️ {{ $t('navigation.favorites') }}
            <span v-if="favoritesCount > 0" class="favorites-badge">
              {{ favoritesCount }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
#app {
  min-height: 100vh;
  background-color: #f8fafc;
}

.app-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: $secondary-color;
  text-decoration: none;

  &:hover {
    color: $primary-color;
  }
}

.nav-links {
  display: flex;
  gap: $spacing-md;
  align-items: center;
}

.nav-link {
  color: $text-color;
  text-decoration: none;
  font-weight: 600;
  padding: $spacing-sm $spacing-md;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #f1f5f9;
    color: $primary-color;
  }

  &.router-link-active {
    background: $primary-color;
    color: white;
  }
}

.favorites-link {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.favorites-badge {
  background: $accent-color;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.app-main {
  min-height: calc(100vh - 70px);
}
</style>
