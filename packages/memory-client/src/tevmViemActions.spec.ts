import { describe, it, expect } from 'bun:test'
import { createClient } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'
import { optimism } from '@tevm/common'

describe('tevmViemActions', () => {
	it('should extend the client with TEVM actions', () => {
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

		expect(client.tevm).toBeDefined()
		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmScript).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
	})
})
