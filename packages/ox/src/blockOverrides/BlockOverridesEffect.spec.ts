import { Effect } from 'effect'
import * as BlockOverrides from 'ox/execution/block-overrides'
import { describe, expect, it } from 'vitest'
import { BlockOverridesEffectLive } from './BlockOverridesEffect.js'

describe('BlockOverridesEffect', () => {
	// Sample block overrides JSON
	const sampleBlockOverridesJson: BlockOverrides.BlockOverridesJson = {
		difficulty: '0x100',
		baseFeePerGas: '0x5',
		timestamp: '0x123456',
		number: '0x10',
		gasLimit: '0x1000000',
	}

	it('should parse block overrides from JSON', async () => {
		const result = await Effect.runPromise(BlockOverridesEffectLive.parseEffect(sampleBlockOverridesJson))

		expect(result).toBeDefined()
		expect(result.difficulty).toBeDefined()
		expect(result.baseFeePerGas).toBeDefined()
		expect(result.timestamp).toBeDefined()
		expect(result.number).toBeDefined()
		expect(result.gasLimit).toBeDefined()
	})

	it('should format block overrides to JSON', async () => {
		// First parse the block overrides
		const blockOverrides = await Effect.runPromise(BlockOverridesEffectLive.parseEffect(sampleBlockOverridesJson))

		// Then format them back to JSON
		const result = await Effect.runPromise(BlockOverridesEffectLive.formatEffect(blockOverrides))

		expect(result).toBeDefined()
		expect(result.difficulty).toBe(sampleBlockOverridesJson.difficulty)
		expect(result.baseFeePerGas).toBe(sampleBlockOverridesJson.baseFeePerGas)
		expect(result.timestamp).toBe(sampleBlockOverridesJson.timestamp)
		expect(result.number).toBe(sampleBlockOverridesJson.number)
		expect(result.gasLimit).toBe(sampleBlockOverridesJson.gasLimit)
	})

	it('should handle invalid inputs gracefully', async () => {
		// Create an invalid block overrides JSON
		const invalidBlockOverridesJson = {
			difficulty: 'invalid', // Not a valid hex string
		} as any

		try {
			await Effect.runPromise(BlockOverridesEffectLive.parseEffect(invalidBlockOverridesJson))
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeDefined()
		}
	})
})
