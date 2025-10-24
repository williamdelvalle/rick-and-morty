import { createRouter, createWebHistory } from 'vue-router'
import CharacterList from '@/components/CharacterList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: CharacterList,
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/pages/FavoriteCharacters.vue'),
  },
  {
    path: '/character/:id',
    name: 'CharacterDetail',
    component: () => import('@/pages/CharacterDetail.vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
