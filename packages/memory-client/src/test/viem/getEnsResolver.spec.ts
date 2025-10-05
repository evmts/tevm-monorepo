import { mainnet } from '@tevm/common'
import { createTestSnapshotClient } from '@tevm/test-node'
import { transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'

describe('getEnsResolver', async () => {
	it('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		const mainnetClient = createTestSnapshotClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 23483670n,
			},
			test: {
				autosave: 'onRequest',
			},
		})
		expect(await mainnetClient.getEnsResolver({ name: 'vitalik.eth' })).toBe(
			'0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
		)
	})
})
