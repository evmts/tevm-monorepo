import { createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsText', async () => {
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
		expect(await mainnetClient.getEnsText({ name: 'wevm.eth', key: 'com.twitter' })).toBe('wevm_dev')
	})
})
