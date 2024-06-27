import { describe, expect, it } from 'bun:test'
import { txToJsonRpcTx } from './txToJsonRpcTx.js'
import { FeeMarketEIP1559Transaction } from '@tevm/tx'
import { EthjsAddress } from '@tevm/utils'
import { createBaseClient } from '@tevm/base-client'
import { getBlockFromRpc } from '@tevm/blockchain'
import { transports } from '@tevm/test-utils'

describe(txToJsonRpcTx.name, () => {
	it('should work', async () => {
		const tx = new FeeMarketEIP1559Transaction({
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
		const client = createBaseClient()
		const vm = await client.getVm()
		const block = await getBlockFromRpc({ blockTag: 121960766n, transport: transports.optimism }, vm.common)
		expect(txToJsonRpcTx(tx, block, 0)).toMatchSnapshot()
	})
})
