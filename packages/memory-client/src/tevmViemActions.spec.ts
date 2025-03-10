import { optimism } from '@tevm/common'
import { createClient } from 'viem'
import { describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmViemActions } from './tevmViemActions.js'

describe('tevmViemActions', () => {
	it('should extend the client with TEVM actions', () => {
		const client = createClient({
			transport: createTevmTransport(),
			chain: optimism,
		}).extend(tevmViemActions())

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
