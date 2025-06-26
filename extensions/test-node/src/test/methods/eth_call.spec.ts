import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, describe, it } from 'vitest'
import { BLOCK_NUMBER, client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_call', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_call',
			params: [
				{ from: PREFUNDED_ACCOUNTS[1].address, to: PREFUNDED_ACCOUNTS[0].address },
				BLOCK_NUMBER,
			],
		})
		await client.stop()

		const entries = getHarLogEntries()
		assert(!entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_call'), 'eth_call should NOT be cached')
	})
})
