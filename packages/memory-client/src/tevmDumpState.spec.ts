import { optimism } from '@tevm/common'
import { createCachedOptimismTransport } from '@tevm/test-utils'
import type { Client } from '@tevm/utils'
import { createClient } from './createClient.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import type { TevmTransport } from './TevmTransport.js'
import { tevmDumpState } from './tevmDumpState.js'

let client: Client<TevmTransport>
const cachedTransport = createCachedOptimismTransport()

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: cachedTransport, blockTag: 142153711n },
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
