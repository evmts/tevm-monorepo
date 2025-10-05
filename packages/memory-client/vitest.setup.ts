import { mainnet, optimism } from '@tevm/common'
import { createTestSnapshotClient } from '@tevm/test-node'
import { transports } from '@tevm/test-utils'
import { afterAll } from 'vitest'

export const mainnetClient = createTestSnapshotClient({
	fork: {
		transport: transports.mainnet,
		blockTag: 19804639n,
	},
	common: mainnet,
})

export const optimismClient = createTestSnapshotClient({
	fork: {
		transport: transports.optimism,
		blockTag: 137897763n,
	},
	common: optimism,
})

afterAll(async () => {
	await mainnetClient.saveSnapshots()
	await optimismClient.saveSnapshots()
})
