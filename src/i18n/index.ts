import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'

// Definir tipos para TypeScript
type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'es'>({
  locale: 'es', // idioma por defecto
  fallbackLocale: 'en', // idioma de respaldo
  messages: {
    en,
    es
  }
})

export default i18n
