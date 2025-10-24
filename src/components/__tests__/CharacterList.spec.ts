import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { i18nMock } from '../../__tests__/i18n-mock'
import CharacterList from '../CharacterList.vue'
import { CharacterService } from '../../services/CharacterService'
import type { ApiResponse } from '../../types/ApiResponse'

vi.mock('@/services/CharacterService', () => ({
  CharacterService: {
    getCharacters: vi.fn(),
    getCharactersByName: vi.fn(),
  },
}))

window.scrollTo = vi.fn()

describe('CharacterList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockCharacters = [
    {
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
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: 'morty.jpg',
      episode: [],
      url: '',
      created: '',
    },
  ]

  const mockApiResponse: ApiResponse = {
    info: {
      count: 2,
      pages: 1,
      next: null,
      prev: null,
    },
    results: mockCharacters,
  }

  const createWrapper = () => {
    return mount(CharacterList, {
      global: {
        plugins: [i18nMock],
        stubs: {
          CharacterCard: {
            template:
              '<div class="character-card" :data-id="character.id">{{ character.name }}</div>',
            props: ['character', 'isFavorite'],
          },
        },
      },
    })
  }

  it('carga y muestra personajes correctamente', async () => {
    vi.mocked(CharacterService.getCharacters).mockResolvedValueOnce(mockApiResponse)
    const wrapper = createWrapper()

    await flushPromises()

    expect(wrapper.findAll('.character-card')).toHaveLength(2)
    expect(wrapper.text()).toContain('Rick Sanchez')
    expect(wrapper.text()).toContain('Morty Smith')
  })

  it('no muestra paginación cuando solo hay una página', async () => {
    vi.mocked(CharacterService.getCharacters).mockResolvedValueOnce(mockApiResponse)
    const wrapper = createWrapper()
    await flushPromises()

    const pagination = wrapper.find('.pagination')
    expect(pagination.exists()).toBe(false)
  })
})
