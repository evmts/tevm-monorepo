import { createCommon, createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '../../cachedTransports.js'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '@tevm/memory-client'

describe.skipIf(!process.env['TEVM_RPC_URLS_MAINNET'])('getEnsAvatar', async () => {
	it.skipIf(!process.env['TEVM_RUN_LIVE_MAINNET_TESTS'])('should work', { timeout: 40_000 }, async () => {
			const blockNumber = 23483670n
			const cachedTransport = createCachedMainnetTransport()
			const mainnetClient = createMemoryClient({
				common: createCommon({ ...mainnet, customCrypto: { kzg: createMockKzg() } }),
				fork: {
					transport: cachedTransport,
					blockTag: blockNumber,
				},
			})
		expect(
			await mainnetClient.getEnsAvatar({
				name: 'wevm.eth',
				blockNumber,
			}),
		).toBe('https://euc.li/wevm.eth')
	})
})
