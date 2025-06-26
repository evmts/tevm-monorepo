import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'

describe.sequential('eth_sendTransaction', () => {
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
		} catch (error) {
		}
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_sendTransaction'), 'eth_sendTransaction should NOT be cached')
	})
})
