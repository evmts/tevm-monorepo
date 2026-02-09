// @ts-nocheck
import { afterAll, beforeAll } from 'vitest'
import { createTestSnapshotClient } from '../createTestSnapshotClient.js'
import { BLOCK_NUMBER, chain } from './constants.js'
import { transports } from './transports.js'

// Global client instance
export const client = createTestSnapshotClient({
	fork: {
		transport: transports.mainnet,
		blockTag: BigInt(BLOCK_NUMBER) + 1n,
	},
	common: chain,
})

beforeAll(async () => {
	await client.server.start()
})

afterAll(async () => {
	await client.server.stop()
})
