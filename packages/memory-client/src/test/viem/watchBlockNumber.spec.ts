import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

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

describe('watchBlockNumber', () => {
	it('watchBlockNumber should work', async () => {
		const createDeferredPromise = <T>() => {
			let resolve: (value: T) => void
			let reject: (reason?: any) => void
			const promise = new Promise<T>((res, rej) => {
				resolve = res
				reject = rej
			})
			return { promise, resolve: resolve!, reject: reject! }
		}
		const resultPromises = [
			createDeferredPromise<bigint>(),
			createDeferredPromise<bigint>(),
			createDeferredPromise<bigint>(),
			createDeferredPromise<bigint>(),
			createDeferredPromise<bigint>(),
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
