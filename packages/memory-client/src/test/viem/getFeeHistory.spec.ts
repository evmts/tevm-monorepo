import { mainnet } from '@tevm/common'
import { SimpleContract, transports } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mc.tevmMine()
})

describe('getFeeHistory', () => {
	it.todo('should work', async () => {
		const blockTag = 23449343n
		const mainnetClient = createMemoryClient({
			common: mainnet,
			fork: {
				transport: transports.mainnet,
				blockTag,
			},
		})
		expect(
			await mainnetClient.getFeeHistory({ blockCount: 3, blockNumber: blockTag, rewardPercentiles: [0, 50, 100] }),
		).toMatchSnapshot()
	})
})
