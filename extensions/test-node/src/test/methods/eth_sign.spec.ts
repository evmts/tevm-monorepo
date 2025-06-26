import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, describe, it } from 'vitest'
import { client } from '../../vitest.setup.js'
import { getHarLogEntries } from '../utils.js'

describe.sequential('eth_sign', () => {
	it('should create a cache entry', async () => {
		// This method only works with local accounts
		try {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_sign',
			params: [PREFUNDED_ACCOUNTS[0].address, '0x'],
		})
		} catch (error) {
		}
		await client.stop()

		const entries = getHarLogEntries()
		assert(entries.some(e => JSON.parse(e.request.postData?.text ?? '').method === 'eth_sign'), 'eth_sign should be cached')
	})
})
