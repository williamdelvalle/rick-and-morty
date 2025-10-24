import type { ApiResponse } from '@/types/ApiResponse.ts'
import type { Character } from '@/types/Character.ts'

export class CharacterService {
  private static readonly BASE_URL = 'https://rickandmortyapi.com/api'

  static async getCharacters(page: number = 1): Promise<ApiResponse> {
    const response = await fetch(`${this.BASE_URL}/character?page=${page}`)

    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }

    return response.json()
  }

  static async getCharactersByName(name: string, page: number = 1): Promise<ApiResponse> {
    const response = await fetch(`${this.BASE_URL}/character?name=${name}&page=${page}`)

    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }

    return response.json()
  }

  static async getCharacterById(id: number): Promise<Character> {
    const response = await fetch(`${this.BASE_URL}/character/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch character')
    }

    return response.json()
  }
}
