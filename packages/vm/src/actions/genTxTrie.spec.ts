import { describe, expect, it } from 'bun:test'
import { KECCAK256_RLP } from '@tevm/utils'
import { genTxTrie } from './genTxTrie.js'

describe('genTxTrie', () => {
	it('should return KECCAK256_RLP when transactions array is empty', async () => {
		// Setup mock block with no transactions
		const mockBlock = {
			transactions: [],
		}

		// Call the function
		const result = await genTxTrie(mockBlock as any)

		// Verify
		expect(result).toBe(KECCAK256_RLP)
	})
})
