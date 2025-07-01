import { transports } from '@tevm/test-utils'
import { afterAll } from 'vitest'
import { createTestSnapshotNode } from '@tevm/test-node'
import { mainnet, optimism } from '@tevm/common'

export const mainnetClient = createTestSnapshotNode({
	fork: {
		transport: transports.mainnet,
		blockTag: 21996939n,
	},
	common: mainnet,
})

export const optimismClient = createTestSnapshotNode({
	fork: {
		transport: transports.optimism,
		blockTag: 125985200n,
	},
	common: optimism,
})

afterAll(async () => {
	await mainnetClient.save()
	await optimismClient.save()
})
