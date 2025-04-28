import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as BinaryStateTree from './BinaryStateTree.js'

// Mock the BinaryStateTree module from Ox
const mockCreate = vi.fn()
const mockInsert = vi.fn()
const mockMerkelize = vi.fn()

vi.mock('ox', () => ({
  default: {
    BinaryStateTree: {
      create: (...args: any[]) => mockCreate(...args),
      insert: (...args: any[]) => mockInsert(...args),
      merkelize: (...args: any[]) => mockMerkelize(...args),
    }
  }
}))

describe('BinaryStateTree', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('create', () => {
    it('should create a new Binary State Tree', async () => {
      const mockTree = { root: { type: 'empty' } }
      mockCreate.mockReturnValue(mockTree)

      const program = BinaryStateTree.create()
      const result = await Effect.runPromise(program)

      expect(result).toBe(mockTree)
      expect(mockCreate).toHaveBeenCalled()
    })

    it('should handle errors properly', async () => {
      const error = new Error('Failed to create tree')
      mockCreate.mockImplementation(() => {
        throw error
      })

      const program = BinaryStateTree.create()

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(BinaryStateTree.CreateError)
        expect(err._tag).toBe('CreateError')
        expect(err.message).toContain('Unexpected error creating BinaryStateTree with ox')
      }
    })
  })

  describe('insert', () => {
    it('should insert a key-value pair into the tree', async () => {
      const mockTree = { root: { type: 'empty' } }
      const mockKey = new Uint8Array([1, 2, 3])
      const mockValue = new Uint8Array([4, 5, 6])

      mockInsert.mockImplementation(() => undefined)

      const program = BinaryStateTree.insert(mockTree, mockKey, mockValue)
      const result = await Effect.runPromise(program)

      expect(result).toBeUndefined()
      expect(mockInsert).toHaveBeenCalledWith(mockTree, mockKey, mockValue)
    })

    it('should handle errors properly', async () => {
      const mockTree = { root: { type: 'empty' } }
      const mockKey = new Uint8Array([1, 2, 3])
      const mockValue = new Uint8Array([4, 5, 6])
      const error = new Error('Invalid key format')

      mockInsert.mockImplementation(() => {
        throw error
      })

      const program = BinaryStateTree.insert(mockTree, mockKey, mockValue)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(BinaryStateTree.InsertError)
        expect(err._tag).toBe('InsertError')
        expect(err.message).toContain('Unexpected error inserting into BinaryStateTree with ox')
      }
    })
  })

  describe('merkelize', () => {
    it('should merkelize a Binary State Tree', async () => {
      const mockTree = { root: { type: 'empty' } }
      const mockHash = new Uint8Array([1, 2, 3, 4, 5])

      mockMerkelize.mockReturnValue(mockHash)

      const program = BinaryStateTree.merkelize(mockTree)
      const result = await Effect.runPromise(program)

      expect(result).toBe(mockHash)
      expect(mockMerkelize).toHaveBeenCalledWith(mockTree)
    })

    it('should handle errors properly', async () => {
      const mockTree = { root: { type: 'empty' } }
      const error = new Error('Tree is invalid')

      mockMerkelize.mockImplementation(() => {
        throw error
      })

      const program = BinaryStateTree.merkelize(mockTree)

      try {
        await Effect.runPromise(program)
        // Should not reach here
        expect(true).toBe(false)
      } catch (err) {
        expect(err).toBeInstanceOf(BinaryStateTree.MerkelizeError)
        expect(err._tag).toBe('MerkelizeError')
        expect(err.message).toContain('Unexpected error merkelizing BinaryStateTree with ox')
      }
    })
  })
})