import type { Block } from '@tevm/block'
import { describe, expect, it } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import type { RunBlockOpts } from '../utils/index.js'
import { applyBlock } from './applyBlock.js'

// Create a simple test for a specific branch in applyBlock to increase coverage
describe('applyBlock', () => {
	it('should throw InternalError if gas limit is too high', async () => {
		// Create a block with invalid gas limit
		const block = {
			header: {
				gasLimit: BigInt('0x8000000000000000'), // >= 2^63
				number: 1n,
				parentHash: new Uint8Array(32),
				timestamp: 1000,
			},
			errorStr: () => 'test block',
		} as unknown as Block

		// Create minimal VM mock needed for this test
		const vm = {
			common: {
				ethjsCommon: {
					hardfork: { name: 'test-hardfork' },
				},
			},
		} as unknown as BaseVm

		const applyBlockFunc = applyBlock(vm)

		let thrown = false
		try {
			await applyBlockFunc(block, { skipBlockValidation: false } as RunBlockOpts)
		} catch (error: unknown) {
			thrown = true
			expect((error as Error).message).toContain('Invalid block with gas limit greater than (2^63 - 1)')
		}

		expect(thrown).toBe(true)
	})
})
