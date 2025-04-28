import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as JsonRpcResponse from './JsonRpcResponse.js'

// Mock the JsonRpcResponse module from Ox
const mockCreateResponse = vi.fn()
const mockParseResponse = vi.fn()
const mockValidateResponse = vi.fn()
const mockGetResponseResult = vi.fn()
const mockGetResponseError = vi.fn()

vi.mock('ox', () => ({
  default: {
    JsonRpcResponse: {
      createResponse: (...args: any[]) => mockCreateResponse(...args),
      parseResponse: (...args: any[]) => mockParseResponse(...args),
      validateResponse: (...args: any[]) => mockValidateResponse(...args),
      getResponseResult: (...args: any[]) => mockGetResponseResult(...args),
      getResponseError: (...args: any[]) => mockGetResponseError(...args),
    }
  }
}))

describe('JsonRpcResponse', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('createResponse', () => {
    it('should create a JSON-RPC response', async () => {
      const params = { id: '1', result: 'success' }
      const mockResponse = { jsonrpc: '2.0', id: '1', result: 'success' }
      mockCreateResponse.mockReturnValue(mockResponse)

      const program = JsonRpcResponse.createResponse(params)
      const result = await Effect.runPromise(program)

      expect(result).toBe(mockResponse)
      expect(mockCreateResponse).toHaveBeenCalledWith(params)
    })

    it('should handle errors properly', async () => {
      const params = { id: '1', result: 'success' }
      const error = new Error('Failed to create response')
      mockCreateResponse.mockImplementation(() => {
        throw error
      })

      const program = JsonRpcResponse.createResponse(params)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(JsonRpcResponse.CreateResponseError)
        expect(err._tag).toBe('CreateResponseError')
        expect(err.message).toContain('Unexpected error creating JSON-RPC response with ox')
      }
    })
  })

  describe('parseResponse', () => {
    it('should parse a JSON-RPC response', async () => {
      const responseStr = '{"jsonrpc":"2.0","id":"1","result":"success"}'
      const mockResponse = { jsonrpc: '2.0', id: '1', result: 'success' }
      mockParseResponse.mockReturnValue(mockResponse)

      const program = JsonRpcResponse.parseResponse(responseStr)
      const result = await Effect.runPromise(program)

      expect(result).toBe(mockResponse)
      expect(mockParseResponse).toHaveBeenCalledWith(responseStr)
    })

    it('should handle errors properly', async () => {
      const responseStr = 'invalid-json'
      const error = new Error('Invalid JSON')
      mockParseResponse.mockImplementation(() => {
        throw error
      })

      const program = JsonRpcResponse.parseResponse(responseStr)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(JsonRpcResponse.ParseResponseError)
        expect(err._tag).toBe('ParseResponseError')
        expect(err.message).toContain('Unexpected error parsing JSON-RPC response with ox')
      }
    })
  })

  describe('validateResponse', () => {
    it('should validate a JSON-RPC response', async () => {
      const response = { jsonrpc: '2.0', id: '1', result: 'success' }
      mockValidateResponse.mockReturnValue(true)

      const program = JsonRpcResponse.validateResponse(response)
      const result = await Effect.runPromise(program)

      expect(result).toBe(true)
      expect(mockValidateResponse).toHaveBeenCalledWith(response)
    })

    it('should handle errors properly', async () => {
      const response = { id: '1', result: 'success' }
      const error = new Error('Invalid response format')
      mockValidateResponse.mockImplementation(() => {
        throw error
      })

      const program = JsonRpcResponse.validateResponse(response as any)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(JsonRpcResponse.ValidateResponseError)
        expect(err._tag).toBe('ValidateResponseError')
        expect(err.message).toContain('Unexpected error validating JSON-RPC response with ox')
      }
    })
  })

  describe('getResponseResult', () => {
    it('should get the result from a JSON-RPC response', async () => {
      const response = { jsonrpc: '2.0', id: '1', result: 'success' }
      mockGetResponseResult.mockReturnValue('success')

      const program = JsonRpcResponse.getResponseResult(response)
      const result = await Effect.runPromise(program)

      expect(result).toBe('success')
      expect(mockGetResponseResult).toHaveBeenCalledWith(response)
    })

    it('should handle errors properly', async () => {
      const response = { jsonrpc: '2.0', id: '1', result: 'success' }
      const error = new Error('Error getting result')
      mockGetResponseResult.mockImplementation(() => {
        throw error
      })

      const program = JsonRpcResponse.getResponseResult(response)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(JsonRpcResponse.GetResponseResultError)
        expect(err._tag).toBe('GetResponseResultError')
        expect(err.message).toContain('Unexpected error getting JSON-RPC response result with ox')
      }
    })
  })

  describe('getResponseError', () => {
    it('should get the error from a JSON-RPC response', async () => {
      const response = { jsonrpc: '2.0', id: '1', error: { code: -32603, message: 'Internal error' } }
      mockGetResponseError.mockReturnValue({ code: -32603, message: 'Internal error' })

      const program = JsonRpcResponse.getResponseError(response)
      const result = await Effect.runPromise(program)

      expect(result).toEqual({ code: -32603, message: 'Internal error' })
      expect(mockGetResponseError).toHaveBeenCalledWith(response)
    })

    it('should handle errors properly', async () => {
      const response = { jsonrpc: '2.0', id: '1', error: { code: -32603, message: 'Internal error' } }
      const error = new Error('Error getting error object')
      mockGetResponseError.mockImplementation(() => {
        throw error
      })

      const program = JsonRpcResponse.getResponseError(response)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(JsonRpcResponse.GetResponseErrorError)
        expect(err._tag).toBe('GetResponseErrorError')
        expect(err.message).toContain('Unexpected error getting JSON-RPC response error with ox')
      }
    })
  })
})