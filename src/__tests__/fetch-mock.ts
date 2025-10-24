import { vi } from 'vitest'

type MockResponse = {
  ok: boolean
  json: () => Promise<any>
  status: number
  statusText: string
}

export const mockFetch = () => {
  const fetchMock = vi.fn<Parameters<typeof fetch>, Promise<MockResponse>>()
  global.fetch = fetchMock
  return fetchMock
}

export const createSuccessResponse = (data: any) => {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve(data),
  }
}

export const createErrorResponse = (status: number = 404, statusText: string = 'Not Found') => {
  return {
    ok: false,
    status,
    statusText,
    json: () => Promise.reject(new Error(statusText)),
  }
}
