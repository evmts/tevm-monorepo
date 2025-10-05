import { mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsText', async () => {
	it('should work', async () => {
		const kzg = await loadKZG()
		const cachedTransport = createCachedMainnetTransport()
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
