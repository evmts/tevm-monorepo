import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from '@tevm/test-node'

describe('getEnsName', async () => {
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
		expect(await mainnetClient.tevm.getEnsName({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' })).toBe(
			'vitalik.eth',
		)
	})
})
