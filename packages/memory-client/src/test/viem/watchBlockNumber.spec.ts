import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(async () => {
	mc = createMemoryClient()
	const deployResult = await mc.tevmDeploy({
		bytecode: SimpleContract.bytecode,
		abi: SimpleContract.abi,
		args: [420n],
		addToBlockchain: true,
	})
	if (!deployResult.createdAddress) {
		throw new Error('contract never deployed')
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	await mc.tevmMine()
})

describe('watchBlockNumber', () => {
	it('watchBlockNumber should work', { timeout: 15_000 }, async () => {
		// After beforeEach, block number is 2 (deploy in block 1, explicit mine to 2)
		const startBlock = await mc.getBlockNumber({ cacheTime: 0 })
		const targetBlock = startBlock + 3n
		const blockNumbers: bigint[] = []
		const errors: Error[] = []
		const done = Promise.withResolvers<void>()
		const unwatch = mc.watchBlockNumber({
			poll: true,
			pollingInterval: 50,
			emitOnBegin: true,
			emitMissed: true,
			onError: (e) => errors.push(e),
			onBlockNumber: (blockNumber) => {
				blockNumbers.push(blockNumber)
				if (blockNumber >= targetBlock) {
					done.resolve()
				}
			},
		})
		try {
			// Mine 3 blocks and give the polling loop time to observe each change.
			await mc.tevmMine()
			await sleep(125)
			await mc.tevmMine()
			await sleep(125)
			await mc.tevmMine()
			await done.promise
			expect(blockNumbers.length).toBeGreaterThanOrEqual(2)
			expect(blockNumbers[blockNumbers.length - 1]).toBeGreaterThanOrEqual(targetBlock)
			// Block numbers should be monotonically increasing
			for (let i = 1; i < blockNumbers.length; i++) {
				expect(blockNumbers[i]).toBeGreaterThanOrEqual(blockNumbers[i - 1]!)
			}
			expect(errors).toHaveLength(0)
		} finally {
			unwatch()
		}
	})
})
