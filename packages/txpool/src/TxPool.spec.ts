import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { createVm } from '@tevm/vm'
import { describe, expect, it } from 'vitest'
import { TxPool } from './TxPool.js'

describe(TxPool.name, () => {
	describe('deepCopy', () => {
		it('should return a deep copy of the tx pool', async () => {
			const common = optimism.copy()
			const blockchain = await createChain({ common })
			const stateManager = createStateManager({})
			const evm = await createEvm({ common, stateManager, blockchain })
			const vm = createVm({
				blockchain,
				common,
				evm,
				stateManager,
			})
			const txPool = new TxPool({ vm })
			const copy = txPool.deepCopy({ vm })
			expect(copy).not.toBe(txPool)
			expect(copy.pool).not.toBe(txPool.pool)
			expect(copy).toEqual(txPool)
			expect((copy as any).vm).toBe(vm)
		})
	})
})
