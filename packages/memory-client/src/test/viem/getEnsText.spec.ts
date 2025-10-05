import { mainnet } from '@tevm/common'
import { createTestSnapshotClient } from '@tevm/test-node'
import { transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'

describe('getEnsText', async () => {
	it('should work', async () => {
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
		expect(await mainnetClient.getEnsText({ name: 'wevm.eth', key: 'com.twitter' })).toBe('wevm_dev')
	})
})
