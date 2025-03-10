import { optimism } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { createClient } from 'viem'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'

describe('tevmViemActions', () => {
	it('should extend the client with TEVM actions', () => {
		const node = createTevmNode().extend(requestEip1193())
		const client = createClient({
			transport: createTevmTransport(node),
			chain: optimism,
		}).extend(tevmViemActions())

		expect(client.tevm).toBeDefined()
		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
	})
})
