<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const changeLanguage = (lang: 'en' | 'es') => {
  locale.value = lang
}
</script>

<template>
  <h1>{{ $t('hello') }}</h1>

  <button
    class="button primary"
    @click="changeLanguage('en')"
    :class="{ active: currentLocale === 'en' }"
  >
    English
  </button>
  <button
    class="button secondary"
    @click="changeLanguage('es')"
    :class="{ active: currentLocale === 'es' }"
  >
    Español
  </button>
</template>

<style lang="scss" scoped>
.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background-color: $primary-color;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.secondary {
    background-color: $secondary-color;
  }
}
</style>
