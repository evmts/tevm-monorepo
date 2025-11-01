import { mainnet } from '@tevm/common'
import { createCachedMainnetTransport } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('getFeeHistory', () => {
	it.todo('should work', async () => {
		const blockTag = 19804639n
		const cachedTransport = createCachedMainnetTransport()
		const mainnetClient = createMemoryClient({
			common: mainnet,
			fork: {
				transport: cachedTransport,
				blockTag,
			},
		})
		expect(
			await mainnetClient.getFeeHistory({ blockCount: 3, blockNumber: blockTag, rewardPercentiles: [0, 50, 100] }),
		).toMatchSnapshot()
	})
})
