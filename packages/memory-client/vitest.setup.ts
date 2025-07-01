import { transports } from '@tevm/test-utils'
import { afterAll, beforeAll } from 'vitest'
import { createTestSnapshotClient } from '@tevm/test-node'
import { mainnet, optimism } from '@tevm/common'

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

beforeAll(async () => {
	await mainnetClient.start()
	await optimismClient.start()
})

afterAll(async () => {
	await mainnetClient.stop()
	await optimismClient.stop()
})
