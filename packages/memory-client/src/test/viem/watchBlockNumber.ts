import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import type { Hex } from 'viem'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

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
	c = {
		simpleContract: SimpleContract.withAddress(deployResult.createdAddress),
	}
	if (!deployResult.txHash) {
		throw new Error('txHash not found')
	}
	deployTxHash = deployResult.txHash
	await mc.tevmMine()
})

describe('watchBlockNumber', () => {
	it('watchBlockNumber should work', async () => {
		const resultPromises = [
			Promise.withResolvers<bigint>(),
			Promise.withResolvers<bigint>(),
			Promise.withResolvers<bigint>(),
			Promise.withResolvers<bigint>(),
			Promise.withResolvers<bigint>(),
		] as const
		const errors: Error[] = []
		const unwatch = mc.watchBlockNumber({
			poll: true,
			pollingInterval: 100,
			emitOnBegin: true,
			emitMissed: false,
			onError: (e) => errors.push(e),
			onBlockNumber: (blockNumber) => {
				resultPromises[Number(blockNumber)]?.resolve(blockNumber)
			},
		})
		for (let i = 1; i <= 4; i++) {
			expect(await resultPromises[i]?.promise).toBe(BigInt(i))
			await mc.tevmMine()
		}
		expect(errors).toHaveLength(0)
		unwatch()
	})
})
