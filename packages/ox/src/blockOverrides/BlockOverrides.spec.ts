import { Effect } from 'effect'
import Ox from 'ox'
import { describe, expect, it, vi } from 'vitest'
import * as BlockOverrides from './BlockOverrides.js'

vi.mock('ox', () => {
	return {
		default: {
			BlockOverrides: {
				parse: vi.fn(),
				format: vi.fn(),
			},
		},
	}
})

describe('BlockOverrides', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	// Sample block overrides JSON
	const sampleBlockOverridesJson = {
		difficulty: '0x100',
		baseFeePerGas: '0x5',
		timestamp: '0x123456',
		number: '0x10',
		gasLimit: '0x1000000',
	}

	// Sample block overrides
	const sampleBlockOverrides = {
		difficulty: 256n,
		baseFeePerGas: 5n,
		timestamp: 1193046n,
		number: 16n,
		gasLimit: 16777216n,
	}

	describe('parse', () => {
		it('should parse block overrides from JSON successfully', async () => {
			vi.mocked(Ox.BlockOverrides.parse).mockReturnValue(sampleBlockOverrides)

			const result = await Effect.runPromise(BlockOverrides.parse(sampleBlockOverridesJson))

			expect(Ox.BlockOverrides.parse).toHaveBeenCalledTimes(1)
			expect(Ox.BlockOverrides.parse).toHaveBeenCalledWith(sampleBlockOverridesJson)
			expect(result).toEqual(sampleBlockOverrides)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to parse block overrides')
			vi.mocked(Ox.BlockOverrides.parse).mockImplementation(() => {
				throw error
			})

			const effect = BlockOverrides.parse(sampleBlockOverridesJson)

			await expect(Effect.runPromise(effect)).rejects.toThrow(BlockOverrides.ParseError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'ParseError',
				_tag: 'ParseError',
				cause: error,
			})
		})
	})

	describe('format', () => {
		it('should format block overrides to JSON successfully', async () => {
			vi.mocked(Ox.BlockOverrides.format).mockReturnValue(sampleBlockOverridesJson)

			const result = await Effect.runPromise(BlockOverrides.format(sampleBlockOverrides))

			expect(Ox.BlockOverrides.format).toHaveBeenCalledTimes(1)
			expect(Ox.BlockOverrides.format).toHaveBeenCalledWith(sampleBlockOverrides)
			expect(result).toEqual(sampleBlockOverridesJson)
		})

		it('should handle errors', async () => {
			const error = new Error('Failed to format block overrides')
			vi.mocked(Ox.BlockOverrides.format).mockImplementation(() => {
				throw error
			})

			const effect = BlockOverrides.format(sampleBlockOverrides)

			await expect(Effect.runPromise(effect)).rejects.toThrow(BlockOverrides.FormatError)
			await expect(Effect.runPromise(effect)).rejects.toMatchObject({
				name: 'FormatError',
				_tag: 'FormatError',
				cause: error,
			})
		})
	})
})
