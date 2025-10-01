import { createTevmNode } from 'tevm'
import { callHandler, getAccountHandler, mineHandler } from 'tevm/actions'
import { describe, expect, it } from 'vitest'

describe('Architecture Overview Examples', () => {
	describe('High-Level Actions', () => {
		it('should demonstrate basic actions usage', async () => {
			const node = createTevmNode()

			// Test contract call
			const contractAddress = '0x1234567890123456789012345678901234567890'
			const calldata = '0x123456'
			const result = await callHandler(node)({
				to: contractAddress,
				data: calldata,
			})
			expect(result).toBeDefined()

			// Test mining
			await mineHandler(node)()

			// Test account state reading
			const accountAddress = '0x1234567890123456789012345678901234567890'
			const account = await getAccountHandler(node)({
				address: accountAddress,
			})
			expect(account).toBeDefined()
		})
	})
})
