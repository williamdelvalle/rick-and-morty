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

<style scoped></style>
