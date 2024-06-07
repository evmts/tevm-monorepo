import { describe, it, expect, beforeEach } from 'bun:test';
import type { MemoryClient } from '../../MemoryClient.js'
import { SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '../../createMemoryClient.js'
import { type Hex } from '@tevm/utils'

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


describe('inspectTxpool', () => {
  it.todo('should work as expected', () => {
    expect(true).toBe(true);
  });
});
