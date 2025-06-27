import { transports } from '@tevm/test-utils'
import { afterAll, beforeAll } from 'vitest'
import { createTestSnapshotClient } from '../createTestSnapshotClient.js'
import { chain, BLOCK_NUMBER } from './constants.js'

// Global client instance
const client = createTestSnapshotClient({
	fork: {
		transport: transports.mainnet,
		blockTag: BigInt(BLOCK_NUMBER) + 1n
	},
	common: chain,
})

beforeAll(async () => {
	await client.start()
})

afterAll(async () => {
	await client.stop()
})
