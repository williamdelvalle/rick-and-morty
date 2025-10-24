import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { i18nMock } from '@/__tests__/i18n-mock'
import CharacterCard from '../CharacterCard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
    {
      path: '/character/:id',
      name: 'CharacterDetail',
      component: { template: '<div>Character Detail</div>' },
    },
  ],
})

describe('CharacterCard', () => {
  const mockCharacter = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'rick.jpg',
    episode: [],
    url: '',
    created: '',
  }

  const createWrapper = (props = {}) => {
    return mount(CharacterCard, {
      props: {
        character: mockCharacter,
        isFavorite: false,
        ...props,
      },
      global: {
        plugins: [router, i18nMock],
        stubs: {
          RouterLink: true,
          'font-awesome-icon': true,
        },
      },
    })
  }

  it('tiene un enlace al detalle del personaje', () => {
    const wrapper = createWrapper()
    const link = wrapper.findComponent({ name: 'RouterLink' })
    expect(link.props('to')).toBe(`/character/${mockCharacter.id}`)
  })

  it('maneja correctamente personajes sin tipo', () => {
    const wrapper = createWrapper()
    const typeElement = wrapper.find('.character-type')
    expect(typeElement.exists()).toBe(false)
  })
})
