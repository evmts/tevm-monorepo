import { SimpleContract } from '@tevm/test-utils'
import { encodeAbiParameters, encodeFunctionData, numberToHex, parseAbiParameters } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>
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
	await mc.tevmMine()
})

describe('getStorageAt', () => {
	it('should work', async () => {
		expect(await mc.getStorageAt({ address: c.simpleContract.address, slot: numberToHex(0) })).toBe(
			// TODO why does this have to be size 2?
			numberToHex(420, { size: 2 }),
		)
	})

	it('should work with blockTag pending', async () => {
		// First check current storage value
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
			}),
		).toBe(numberToHex(420, { size: 2 }))

		// Send a transaction to update storage but don't mine it
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [999n],
		})

		await mc.sendTransaction({
			to: c.simpleContract.address,
			data: setCallData,
			account: '0x1234567890123456789012345678901234567890',
		})

		// Get storage at latest block - should still be old value
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
			}),
		).toBe(numberToHex(420, { size: 2 }))

		// Get storage at pending block - should be new value
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
				blockTag: 'pending',
			}),
		).toBe(numberToHex(999, { size: 2 }))
	})
})
