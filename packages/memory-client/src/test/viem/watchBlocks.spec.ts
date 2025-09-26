import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import { Block } from 'viem'

let mc = createMemoryClient()

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

describe('watchBlocks', () => {
	it('should work', async () => {
		const createDeferredPromise = <T>() => {
			let resolve: (value: T) => void
			let reject: (reason?: any) => void
			const promise = new Promise<T>((res, rej) => {
				resolve = res
				reject = rej
			})
			return { promise, resolve: resolve!, reject: reject! }
		}
		const expectedBlock = createDeferredPromise<Block>()
		const unwatch = mc.watchBlocks({
			poll: true,
			pollingInterval: 100,
			onBlock: (block) => {
				block.hash = '0xredacted'
				block.stateRoot = '0xredacted'
				block.parentHash = '0xredacted'
				block.timestamp = 69n
				expectedBlock.resolve(block)
			},
		})
		await mc.tevmMine()
		expect(await expectedBlock.promise).toMatchSnapshot()
		unwatch()
	})
})
