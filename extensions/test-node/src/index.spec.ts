import { http } from 'viem'
import { expect, it } from 'vitest'
import { createTestSnapshotClient } from './index.js'

it('should be able to create a test client', () => {
	const client = createTestSnapshotClient({ fork: { transport: http('https://mainnet.optimism.io')({}) } })
	expect(client).toBeDefined()
})
