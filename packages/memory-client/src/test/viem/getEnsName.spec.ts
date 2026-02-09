import { createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsName', async () => {
	it('should work', { timeout: 40_000 }, async () => {
		const kzg = createMockKzg()
		const cachedTransport = createCachedMainnetTransport({ snapshotOnly: true })
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: cachedTransport,
				blockTag: 23483670n,
			},
		})
		expect(await mainnetClient.getEnsName({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' })).toBe(
			'vitalik.eth',
		)
	})
})
