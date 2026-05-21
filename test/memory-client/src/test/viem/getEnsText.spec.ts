import { createCommon, createMockKzg, mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '../../cachedTransports.js'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '@tevm/memory-client'

describe('getEnsText', async () => {
	it.skip('should work', async () => {
		const blockNumber = 23483670n
		const cachedTransport = createCachedMainnetTransport()
		const mainnetClient = createMemoryClient({
			common: createCommon({ ...mainnet, customCrypto: { kzg: createMockKzg() } }),
			fork: {
				transport: cachedTransport,
				blockTag: blockNumber,
			},
		})
		expect(await mainnetClient.getEnsText({ name: 'wevm.eth', key: 'com.twitter', blockNumber })).toBe('wevm_dev')
	})
})
