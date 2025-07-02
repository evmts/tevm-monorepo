import { optimism } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import type { TevmTransport } from './TevmTransport.js'
import { tevmDumpState } from './tevmDumpState.js'
import { createTestSnapshotTransport } from '@tevm/test-node'

let client: Client<TevmTransport>
const cachedTransport = createTestSnapshotTransport({
	transport: transports.optimism,
	test: {
		autosave: 'onRequest',
	}
})

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: cachedTransport },
		}),
		chain: optimism,
	})
})

describe('tevmDumpState', () => {
	it('should dump the state of the TEVM', async () => {
		const stateDump = await tevmDumpState(client)
		expect(stateDump).toMatchSnapshot()
	})
})
