import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { getTestClient } from '../../core/client.js'
import { assertMethodCached } from '../utils.js'

describe('eth_sign', () => {
	const client = getTestClient()

	it('should create a cache entry', async () => {
		// This method only works with local accounts
		try {
			await client.tevm.transport.tevm.forkTransport?.request({
				method: 'eth_sign',
				params: [PREFUNDED_ACCOUNTS[0].address, '0x'],
			})
		} catch (error) {}
		await client.flush()

		assertMethodCached('eth_sign')
	})
})
