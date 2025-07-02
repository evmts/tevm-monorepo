import { mainnet } from '@tevm/common'
import { transports } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { createTestSnapshotClient } from '@tevm/test-node'

describe('getFeeHistory', () => {
	it.todo('should work', async () => {
		const blockTag = 19804639n
		const mainnetClient = createTestSnapshotClient({
			common: mainnet,
			fork: {
				transport: transports.mainnet,
				blockTag,
			},
			test: {
				autosave: 'onRequest'
			}
		})
		expect(
			await mainnetClient.getFeeHistory({ blockCount: 3, blockNumber: blockTag, rewardPercentiles: [0, 50, 100] }),
		).toMatchSnapshot()
	})
})
