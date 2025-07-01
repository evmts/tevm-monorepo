import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Hex } from 'viem'
import { describe, it } from 'vitest'
import { chain } from '../constants.js'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_sendRawTransaction', () => {
	it('should NOT create a cache entry', async () => {
		const nonce = (await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_getTransactionCount',
			params: [PREFUNDED_ACCOUNTS[0].address, 'latest'],
		})) as Hex
		const tx = await PREFUNDED_ACCOUNTS[0].signTransaction({
			to: PREFUNDED_ACCOUNTS[1].address,
			data: '0x',
			gas: 21_000n,
			gasPrice: 1_000_000_000n,
			nonce: Number(nonce),
			chainId: chain.id,
		})

		// This will fail on an actual chain as the account most probably doesn't have enough balance
		try {
			await client.tevm.transport.tevm.forkTransport?.request({
				method: 'eth_sendRawTransaction',
				params: [tx],
			})
		} catch (error) {}

		assertMethodNotCached('eth_sendRawTransaction')
	})
})
