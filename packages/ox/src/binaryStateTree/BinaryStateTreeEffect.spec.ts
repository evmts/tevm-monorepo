import { Effect } from 'effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BinaryStateTreeEffectLive, BinaryStateTreeEffectService } from './BinaryStateTreeEffect.js'

// Mock the BinaryStateTree module
const mockCreate = vi.fn()
const mockInsert = vi.fn()
const mockMerkelize = vi.fn()

vi.mock('ox/BinaryStateTree', () => ({
	create: (...args: any[]) => mockCreate(...args),
	insert: (...args: any[]) => mockInsert(...args),
	merkelize: (...args: any[]) => mockMerkelize(...args),
}))

describe('BinaryStateTreeEffect', () => {
	const binaryStateTree: BinaryStateTreeEffectService = BinaryStateTreeEffectLive

	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('createEffect', () => {
		it('should create a new Binary State Tree', async () => {
			const mockTree = { root: { type: 'empty' } }
			mockCreate.mockReturnValue(mockTree)

			const result = await Effect.runPromise(binaryStateTree.createEffect())

			expect(result).toBe(mockTree)
			expect(mockCreate).toHaveBeenCalled()
		})

		it('should handle errors properly', async () => {
			const error = new Error('Failed to create tree')
			mockCreate.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(binaryStateTree.createEffect())
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeDefined()
				expect(err.message).toContain('An unknown error occurred in Effect.try')
			}
		})
	})

	describe('insertEffect', () => {
		it('should insert a key-value pair into the tree', async () => {
			const mockTree = { root: { type: 'empty' } }
			const mockKey = new Uint8Array([1, 2, 3])
			const mockValue = new Uint8Array([4, 5, 6])

			mockInsert.mockImplementation(() => undefined)

			const result = await Effect.runPromise(binaryStateTree.insertEffect(mockTree, mockKey, mockValue))

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

			try {
				await Effect.runPromise(binaryStateTree.insertEffect(mockTree, mockKey, mockValue))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeDefined()
				expect(err.message).toContain('An unknown error occurred in Effect.try')
			}
		})
	})

	describe('merkelizeEffect', () => {
		it('should merkelize a Binary State Tree', async () => {
			const mockTree = { root: { type: 'empty' } }
			const mockHash = new Uint8Array([1, 2, 3, 4, 5])

			mockMerkelize.mockReturnValue(mockHash)

			const result = await Effect.runPromise(binaryStateTree.merkelizeEffect(mockTree))

			expect(result).toBe(mockHash)
			expect(mockMerkelize).toHaveBeenCalledWith(mockTree)
		})

		it('should handle errors properly', async () => {
			const mockTree = { root: { type: 'empty' } }
			const error = new Error('Tree is invalid')

			mockMerkelize.mockImplementation(() => {
				throw error
			})

			try {
				await Effect.runPromise(binaryStateTree.merkelizeEffect(mockTree))
				// Should not reach here
				expect(true).toBe(false)
			} catch (err) {
				expect(err).toBeDefined()
				expect(err.message).toContain('An unknown error occurred in Effect.try')
			}
		})
	})
})
