import { SimpleContract } from '@tevm/contract'
import { testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('mine', () => {
	it('should work as expected', async () => {
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
		await mc.mine({ blocks: 1 })
		const vm = await mc.tevm.getVm()
		const block = await vm.blockchain.getCanonicalHeadBlock()
		expect(block.header.number).toEqual(1n)
		expect(await mc.getBlockNumber()).toEqual(1n)
		expect(await mc.getBytecode({ address: c.simpleContract.address })).toEqual(SimpleContract.deployedBytecode)
	})

	it('should be able to mine multiple blocks', async () => {
		await mc.mine({ blocks: 3 })
		expect(await mc.getBlockNumber()).toEqual(3n)
	})

	it('should be able to mine blocks with an interval', async () => {
		await mc.mine({ blocks: 2, interval: 1000 })
		expect(await mc.getBlockNumber()).toEqual(2n)
		const block1 = await mc.getBlock({ blockNumber: 1n })
		const block2 = await mc.getBlock({ blockNumber: 2n })
		expect(block2.timestamp - block1.timestamp).toBeGreaterThanOrEqual(1000n)
		expect(block2.timestamp - block1.timestamp).toBeLessThanOrEqual(1002n)
	})
})
