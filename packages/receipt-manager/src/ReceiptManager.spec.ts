import { describe, expect, it } from 'bun:test'
import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { ReceiptsManager } from './RecieptManager.js'
import { createMapDb } from './createMapDb.js'

const createEmptyChain = () => {
	const common = optimism.copy()
	return createChain({ common })
}

describe(ReceiptsManager.name, () => {
	describe(ReceiptsManager.prototype.deepCopy.name, () => {
		it('should return a deep copy of the object', async () => {
			const chain = await createEmptyChain()
			const cache = new Map()
			const receiptManager = new ReceiptsManager(createMapDb({ cache }), chain)
			const receiptManagerCopy = receiptManager.deepCopy(chain)
			expect((receiptManagerCopy.mapDb as any)._cache).toEqual((receiptManager.mapDb as any)._cache)
			expect(receiptManagerCopy).not.toBe(receiptManager)
			expect(receiptManagerCopy.chain).toBe(chain)
			expect(receiptManagerCopy.mapDb).not.toBe(receiptManager.mapDb)
		})
	})
})
