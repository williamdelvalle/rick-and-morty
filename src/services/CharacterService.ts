import type { ApiResponse } from '@/types/ApiResponse.ts'

export class CharacterService {
  private static readonly BASE_URL = 'https://rickandmortyapi.com/api'

  static async getCharacters(): Promise<ApiResponse> {
    const response = await fetch(`${this.BASE_URL}/character`)

    if (!response.ok) {
      throw new Error('Failed to fetch characters')
    }

    return response.json()
  }
}
