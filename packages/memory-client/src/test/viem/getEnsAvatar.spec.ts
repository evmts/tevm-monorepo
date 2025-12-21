import { mainnet } from '@tevm/common'
import { /* createCachedMainnetTransport, */ transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsAvatar', async () => {
	it('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		// TODO: we can't use a cached transport here otherwise some other test will reuse it because of createMemoryClient cache, see TODO issue in extensions/test-node/src/snapshot/createCachedTransport.ts
		// const cachedTransport = createCachedMainnetTransport()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
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
