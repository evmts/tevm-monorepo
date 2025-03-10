import { optimism } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmDumpState } from './tevmDumpState.js'

let client: Client<TevmTransport>

beforeEach(async () => {
	const node = createTevmNode({
		fork: { transport: transports.optimism },
	}).extend(requestEip1193())
	
	client = createClient({
		transport: createTevmTransport(node),
		chain: optimism,
	})
})

describe('tevmDumpState', () => {
	it('should dump the state of the TEVM', async () => {
		const stateDump = await tevmDumpState(client)
		expect(stateDump).toMatchSnapshot()
	})
})
