import { mainnet, optimism } from '@tevm/common'
import { createTestSnapshotNode } from '@tevm/test-node'
import { transports } from '@tevm/test-utils'
import { afterAll } from 'vitest'

export const mainnetNode = createTestSnapshotNode({
	fork: {
		transport: transports.mainnet,
		blockTag: 22831398n,
	},
	common: mainnet,
})

export const optimismNode = createTestSnapshotNode({
	fork: {
		transport: transports.optimism,
		blockTag: 137930007n,
	},
	common: optimism,
})

afterAll(async () => {
	await mainnetNode.saveSnapshots()
	await optimismNode.saveSnapshots()
})
