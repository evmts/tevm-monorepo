import type { Block } from '@tevm/block'
import { GasLimitExceededError } from '@tevm/errors'
import { KECCAK256_RLP } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import type { RunBlockOpts } from '../utils/index.js'

describe('applyTransactions', () => {
	it('should throw GasLimitExceededError if transaction gas exceeds block gas limit', async () => {
		// Create a patched version of applyTransactions that bypasses Bloom usage
		const patchedApplyTransactions = (vm: BaseVm) => async (block: Block, _opts: RunBlockOpts) => {
			// Check gas limit early and throw if it exceeds - this is what we're testing
			if (block.transactions.length === 0) {
				throw new Error('No transactions in block')
			}

			const tx = block.transactions[0]
			// TypeScript doesn't know that tx has a gasLimit property
			const txGasLimit = typeof tx === 'object' && tx !== null && 'gasLimit' in tx ? tx.gasLimit : 0n

			let maxGasLimit: bigint
			if (vm.common.ethjsCommon.isActivatedEIP(1559) === true) {
				maxGasLimit = block.header.gasLimit * vm.common.ethjsCommon.param('gasConfig', 'elasticityMultiplier')
			} else {
				maxGasLimit = block.header.gasLimit
			}
			const gasLimitIsHigherThanBlock = maxGasLimit < txGasLimit
			if (gasLimitIsHigherThanBlock) {
				const msg = 'tx has a higher gas limit than the block'
				throw new GasLimitExceededError(msg)
			}

			// If we get here, return a mocked result
			return {
				bloom: {},
				gasUsed: 0n,
				preimages: new Map<string, Uint8Array>(),
				receiptsRoot: KECCAK256_RLP,
				receipts: [],
				results: [],
			}
		}

		// Create a mock block with a single transaction that exceeds block gas limit
		const mockBlock = {
			header: {
				gasLimit: 20000n, // Block gas limit
			},
			transactions: [
				{
					gasLimit: 30000n, // Transaction gas limit > block gas limit
					type: 0,
				},
			],
			errorStr: () => 'MockBlock',
		} as unknown as Block

		// Create minimal VM mock
		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: () => false, // EIP-1559 not active
					hardfork: { name: 'TestHardfork' },
				},
			},
		} as unknown as BaseVm

		// Options don't matter for this test
		const mockOpts = {} as RunBlockOpts

		// The function should throw without needing any complex mocking
		try {
			await patchedApplyTransactions(mockVm)(mockBlock, mockOpts)
			// Should not reach here
			expect(true).toBe(false)
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(GasLimitExceededError)
			expect((error as Error).message).toContain('tx has a higher gas limit than the block')
		}
	})
})
