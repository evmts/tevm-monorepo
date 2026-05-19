import { mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '../../cachedTransports.js'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '@tevm/memory-client'

describe.skipIf(!process.env['TEVM_RPC_URLS_MAINNET'])('getEnsAvatar', async () => {
	it.skipIf(!process.env['TEVM_RUN_LIVE_MAINNET_TESTS'])('should work', { timeout: 40_000 }, async () => {
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
