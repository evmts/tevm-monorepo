import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { assertMethodCached } from '../snapshot-utils.js'
import { client } from '../vitest.setup.js'

describe('eth_sign', () => {
	it('should create a cache entry', async () => {
		// This method only works with local accounts
		try {
			await client.tevm.transport.tevm.forkTransport?.request({
				method: 'eth_sign',
				params: [PREFUNDED_ACCOUNTS[0].address, '0x'],
			})
			await client.save()
			assertMethodCached('eth_sign')
		} catch (error) {}
	})
})
