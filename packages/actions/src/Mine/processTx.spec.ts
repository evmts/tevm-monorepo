import { createTevmNode } from '@tevm/node'
import { TransactionFactory } from '@tevm/tx'
import { PREFUNDED_PRIVATE_KEYS, hexToBytes } from '@tevm/utils'
import { BlockBuilder } from '@tevm/vm'
import { describe, expect, it } from 'vitest'
import { processTx } from './processTx.js'

describe('processTx', () => {
	it('should process a transaction successfully', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		const parentBlock = await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock())
		const blockBuilder = new BlockBuilder(vm, { parentBlock })
		const receipts: any[] = []

		const tx = TransactionFactory.fromTxData({
			to: '0x1234567890123456789012345678901234567890',
			value: 1000n,
			gasLimit: 21000n,
			gasPrice: 10n,
		}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

		await processTx(client, tx, blockBuilder, receipts)

		expect(receipts).toHaveLength(1)
		expect(receipts[0]).toBeDefined()
		expect(receipts[0].status).toBe(1)
	})
})
