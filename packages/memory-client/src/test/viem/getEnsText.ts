import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'bun:test'
import { createMemoryClient } from '../../createMemoryClient.js'
import { mainnet } from '@tevm/common'
import { loadKZG } from 'kzg-wasm'

describe('getEnsText', async () => {
	it.todo('should work', async () => {
		const kzg = await loadKZG()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 19804639n,
			},
		})
		expect(await mainnetClient.getEnsText({ name: 'vitalik.eth', key: 'key' })).toBe(
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		)
	})
})
