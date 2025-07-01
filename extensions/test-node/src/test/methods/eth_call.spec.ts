import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { describe, it } from 'vitest'
import { BLOCK_NUMBER } from '../constants.js'
import { assertMethodNotCached } from '../utils.js'
import { client } from '../vitest.setup.js'

describe('eth_call', () => {
	it('should NOT create a cache entry', async () => {
		await client.tevm.transport.tevm.forkTransport?.request({
			method: 'eth_call',
			params: [{ from: PREFUNDED_ACCOUNTS[1].address, to: PREFUNDED_ACCOUNTS[0].address }, BLOCK_NUMBER],
		})

		assertMethodNotCached('eth_call')
	})
})
