import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from '@tevm/test-node'

describe('getEnsAvatar', async () => {
	it('should work', { timeout: 40_000 }, async () => {
		const kzg = await loadKZG()
		const mainnetClient = createTestSnapshotClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 23483670n,
			},
			test: {
				autosave: 'onRequest'
			}
		})
		expect(
			await mainnetClient.tevm.getEnsAvatar({
				name: 'wevm.eth',
			}),
		).toBe('https://euc.li/wevm.eth')
	})
})
