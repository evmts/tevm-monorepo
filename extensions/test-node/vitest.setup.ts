import path from 'node:path'
import { optimism } from '@tevm/common'
import { http } from 'viem'
import { afterEach, beforeEach, expect } from 'vitest'
import { createTestSnapshotClient } from './src/index.js'
import type { TestSnapshotClient } from './src/types.js'

export const BLOCK_NUMBER = '0x833493e'

export let client: TestSnapshotClient

beforeEach(async () => {
	client = createTestSnapshotClient({
		tevm: {
			// TODO: replace with test-utils transports.optimism
			fork: { transport: http('https://mainnet.optimism.io')({}), blockTag: BigInt(BLOCK_NUMBER) },
			common: optimism,
			loggingLevel: 'debug'
		},
		snapshot: { dir: path.join(process.cwd(), '__snapshots__', expect.getState().currentTestName ?? 'test') },
	})

	await client.start()
})

afterEach(async () => {
	await client.stop()
})
