# 🪐 Rick and Morty Vue App

Una aplicación web moderna construida con Vue.js 3, TypeScript y Pinia para explorar el universo de Rick and Morty.

## ✨ Características

- **🔍 Búsqueda en tiempo real** de personajes
- **❤️ Sistema de favoritos** con persistencia local
- **📱 Diseño responsive** optimizado para PC
- **🌐 Internacionalización** (Español/Inglés)
- **⚡ TypeScript** para mejor desarrollo
- **🎨 Estilos con SCSS** y variables CSS
- **🔄 Estado global** con Pinia
- **🚀 Navegación SPA** con Vue Router

## 🚀 Comenzando

### Prerrequisitos

- Node.js 16 o superior
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd rick-and-morty
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Comandos Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Previsualizar build
npm run lint         # Linter y formateo
npm run type-check   # Verificación de tipos
```

## 🗺️ Guía de Navegación

### Páginas Principales

#### 1. **Lista de Personajes** (`/`)
- **Acceso**: Página principal o navegación "Personajes"
- **Funcionalidades**:
    - Ver todos los personajes en grid
    - Buscar personajes por nombre
    - Navegación por páginas
    - Agregar/quitar favoritos
    - Click en imagen o nombre para ver detalle

#### 2. **Personajes Favoritos** (`/favorites`)
- **Acceso**: Menú "Favoritos" (con contador)
- **Funcionalidades**:
    - Ver personajes favoritos
    - Eliminar personajes individualmente
    - Limpiar todos los favoritos
    - Acceder al detalle

#### 3. **Detalle del Personaje** (`/character/:id`)
- **Acceso**: Click en cualquier personaje
- **Información mostrada**:
    - Imagen grande
    - Estado, especie, género
    - Origen y ubicación
    - Lista de episodios
    - Fecha de creación

## 🛠️ Stack Tecnológico

- **Frontend**: Vue.js 3 (Composition API)
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Estado**: Pinia
- **Routing**: Vue Router 4
- **i18n**: Vue I18n
- **Styling**: SCSS
- **API**: Rick and Morty API

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── CharacterList.vue
│   └── CharacterCard.vue
├── pages/
│   ├── FavoriteCharacters.vue
│   └── CharacterDetail.vue
├── stores/
│   └── favorites.ts
├── locales/
│   ├── en.json
│   └── es.json
├── types/
│   └── Character.ts
├── services/
│   └── characterService.ts
├── styles/
│   ├── main.scss
│   └── _variables.scss
├── router/
│   └── index.ts
├── App.vue
└── main.ts
```

## 🔧 Configuración

### Variables SCSS

```scss
$primary-color: #42b883;
$secondary-color: #35495e;
$accent-color: #ff6b6b;
$text-color: #2c3e50;

$spacing-xs: 0.5rem;
$spacing-sm: 1rem;
$spacing-md: 1.5rem;
$spacing-lg: 2rem;
$spacing-xl: 3rem;
```

### Rutas

```typescript
const routes = [
{ path: '/', name: 'Home', component: CharacterList },
{ path: '/favorites', name: 'Favorites', component: FavoriteCharacters },
{ path: '/character/:id', name: 'CharacterDetail', component: CharacterDetail }
]
```

## 🐛 Solución de Problemas

**❌ "Variable $spacing-xl no existe"**
- Verificar archivo `src/styles/_variables.scss`

**❌ Error de tipos TypeScript**
- Ejecutar `npm run type-check`

**❌ Favoritos no se persisten**
- Verificar localStorage del navegador

**❌ API no responde**
- Verificar conexión a internet

## 📱 Compatibilidad

- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos**: Optimizado para escritorio

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature
3. Commit de cambios
4. Push a la rama
5. Abrir Pull Request

## 📄 Licencia

MIT License

---

**¡Disfruta explorando el multiverso de Rick and Morty!** 🚀