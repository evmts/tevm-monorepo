import { createCommon, createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '../../cachedTransports.js'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '@tevm/memory-client'

describe('getEnsAddress', async () => {
	it.skip('should work', { timeout: 40_000 }, async () => {
		const blockNumber = 23531308n
		const cachedTransport = createCachedMainnetTransport()
		const mainnetClient = createMemoryClient({
			common: createCommon({ ...mainnet, customCrypto: { kzg: createMockKzg() } }),
			fork: {
				transport: cachedTransport,
				blockTag: blockNumber,
			},
		})
		expect(await mainnetClient.getEnsAddress({ name: 'vitalik.eth', blockNumber })).toBe(
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		)
	})
})
