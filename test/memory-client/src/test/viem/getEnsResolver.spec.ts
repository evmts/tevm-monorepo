import { createCommon, createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '../../cachedTransports.js'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '@tevm/memory-client'

describe('getEnsResolver', async () => {
	it.skip('should work', { timeout: 40_000 }, async () => {
		const blockNumber = 23483670n
		const cachedTransport = createCachedMainnetTransport()
		const mainnetClient = createMemoryClient({
			common: createCommon({ ...mainnet, customCrypto: { kzg: createMockKzg() } }),
			fork: {
				transport: cachedTransport,
				blockTag: blockNumber,
			},
		})
		expect(await mainnetClient.getEnsResolver({ name: 'vitalik.eth', blockNumber })).toBe(
			'0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
		)
	})
})
