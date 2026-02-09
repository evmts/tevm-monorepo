import { createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsAddress', async () => {
	it('should work', { timeout: 40_000 }, async () => {
		const kzg = createMockKzg()
		const cachedTransport = createCachedMainnetTransport({ snapshotOnly: true })
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: cachedTransport,
				blockTag: 23531308n,
			},
		})
		expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth' })).toBe(
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		)
	})
})
