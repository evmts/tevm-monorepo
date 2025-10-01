import { createAddress } from '@tevm/address'
import { getBlockFromRpc } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { FeeMarketEIP1559Transaction } from '@tevm/tx'
import { describe, expect, it } from 'vitest'
import { txToJsonRpcTx } from './txToJsonRpcTx.js'

describe(txToJsonRpcTx.name, () => {
	it('should work', async () => {
		const tx = new FeeMarketEIP1559Transaction({
			to: createAddress(`0x${'a'.repeat(40)}`),
			data: Uint8Array.from([1, 2, 3]),
			value: 100n,
			nonce: 1n,
			maxFeePerGas: 100n,
			chainId: 1n,
			v: 1n,
			r: 2n,
			s: 3n,
			gasLimit: 100n,
			maxPriorityFeePerGas: 100n,
		})
		const client = createTevmNode({
			common: optimism,
		})
		const vm = await client.getVm()
		const [block] = await getBlockFromRpc(
			vm.blockchain,
			{ blockTag: 141658503n, transport: transports.optimism },
			vm.common,
		)
		expect(txToJsonRpcTx(tx, block, 0)).toMatchSnapshot()
	})
})
