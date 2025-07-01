import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_sendTransaction', () => {
	it('should NOT create a cache entry', async () => {
		// Method might not be implemented (only with metamask)
		try {
			await client.tevm.transport.tevm.forkTransport?.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: PREFUNDED_ACCOUNTS[0].address,
						to: PREFUNDED_ACCOUNTS[1].address,
						data: '0x',
					},
				],
			})
		} catch (error) {}

		assertMethodNotCached('eth_sendTransaction')
	})
})
