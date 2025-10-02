import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsResolver', async () => {
	it.todo('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 23483670n,
			},
		})
		expect(await mainnetClient.getEnsResolver({ name: 'vitalik.eth' })).toBe(
			'0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
		)
	})
})
