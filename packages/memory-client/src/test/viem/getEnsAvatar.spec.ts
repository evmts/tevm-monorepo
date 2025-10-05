import { mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsAvatar', async () => {
	it('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		const cachedTransport = createCachedMainnetTransport()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: cachedTransport,
				blockTag: 23483670n,
			},
		})
		expect(
			await mainnetClient.getEnsAvatar({
				name: 'wevm.eth',
			}),
		).toBe('https://euc.li/wevm.eth')
	})
})
