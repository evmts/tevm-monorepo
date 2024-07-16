import { createBaseClient } from '@tevm/base-client'
import { getBlockFromRpc } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { FeeMarketEIP1559Transaction } from '@tevm/tx'
import { EthjsAddress } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { txToJsonRpcTx } from './txToJsonRpcTx.js'

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
		const client = createBaseClient({
			common: optimism,
		})
		const vm = await client.getVm()
		const [block] = await getBlockFromRpc(
			vm.blockchain,
			{ blockTag: 121960766n, transport: transports.optimism },
			vm.common,
		)
		expect(txToJsonRpcTx(tx, block, 0)).toMatchSnapshot()
	})
})
