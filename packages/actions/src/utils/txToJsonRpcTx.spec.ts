import { getBlockFromRpc } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { FeeMarket1559Transaction } from '@tevm/tx'
import { EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { txToJSONRPCTx } from './txToJSONRPCTx.js'

describe(txToJSONRPCTx.name, () => {
	it('should work', async () => {
		const tx = new FeeMarket1559Transaction({
			to: EthjsAddress.fromString(`0x${'a'.repeat(40)}`),
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
			{ blockTag: 121960766n, transport: transports.optimism },
			vm.common,
		)
		expect(txToJSONRPCTx(tx, block, 0)).toMatchSnapshot()
	})
})
