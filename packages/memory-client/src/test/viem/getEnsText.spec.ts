import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { loadKZG } from 'kzg-wasm'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getEnsText', async () => {
	it.todo('should work', async () => {
		const kzg = await loadKZG()
		const mainnetClient = createMemoryClient({
			common: Object.assign({ kzg }, mainnet),
			fork: {
				transport: transports.mainnet,
				blockTag: 23483670n,
			},
		})
		expect(await mainnetClient.getEnsText({ name: 'vitalik.eth', key: 'key' })).toBe(
			'0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		)
	})
})
