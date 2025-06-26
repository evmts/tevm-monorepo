import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodNotCached } from '../utils.js'

describe('eth_sendTransaction', () => {
	const client = getTestClient()

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
		await client.flush()

		assertMethodNotCached('eth_sendTransaction')
	})
})
