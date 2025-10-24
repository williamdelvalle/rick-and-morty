import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CharacterService } from '../CharacterService'
import { createSuccessResponse, mockFetch } from '@/__tests__/fetch-mock'

describe('CharacterService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch()
  })

  describe('getCharacters', () => {
    it('obtiene la lista de personajes correctamente', async () => {
      const mockResponse = {
        info: { count: 1, pages: 1 },
        results: [{ id: 1, name: 'Rick' }],
      }
      global.fetch = vi.fn().mockResolvedValueOnce(createSuccessResponse(mockResponse))

      const result = await CharacterService.getCharacters()
      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1')
    })
  })

  describe('getCharacterById', () => {
    it('obtiene un personaje por ID correctamente', async () => {
      const mockCharacter = { id: 1, name: 'Rick' }
      global.fetch = vi.fn().mockResolvedValueOnce(createSuccessResponse(mockCharacter))

      const result = await CharacterService.getCharacterById(1)
      expect(result).toEqual(mockCharacter)
      expect(fetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character/1')
    })
  })
})
