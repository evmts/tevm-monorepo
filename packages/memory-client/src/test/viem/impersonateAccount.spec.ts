import { beforeEach, describe, expect, it } from 'bun:test'
import { SimpleContract } from '@tevm/contract'
import { type Hex } from '@tevm/utils'
import { type TestActions, testActions } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient & TestActions
let deployTxHash: Hex
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
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

describe('impersonateAccount', () => {
	it('should work as expected', async () => {
		const address = `0x${'42'.repeat(20)}` as const
		await mc.impersonateAccount({ address })
		expect(mc._tevm.getImpersonatedAccount()).toBe(address)
	})
})
