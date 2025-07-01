import { transports } from '@tevm/test-utils'
import { afterAll } from 'vitest'
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

afterAll(async () => {
	await mainnetClient.save()
	await optimismClient.save()
})
