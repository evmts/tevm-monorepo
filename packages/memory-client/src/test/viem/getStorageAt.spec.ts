import { SimpleContract } from '@tevm/test-utils'
import { encodeAbiParameters, encodeFunctionData, numberToHex, parseAbiParameters, parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>
let c = {
	simpleContract: SimpleContract.withAddress(`0x${'00'.repeat(20)}`),
}
const TEST_ACCOUNT = '0x1234567890123456789012345678901234567890'

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()

	// Set up test account with enough balance for transactions
	await mc.setBalance({
		address: TEST_ACCOUNT,
		value: parseEther('10'), // 10 ETH should be enough
	})

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

	it.skip('should work with blockTag pending', async () => {
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
			account: TEST_ACCOUNT,
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

	it.skip('should reflect multiple sequential pending storage updates', async () => {
		// Initial value check
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
			}),
		).toBe(numberToHex(420, { size: 2 }))

		// First update
		const setCallData1 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [555n],
		})

		await mc.sendTransaction({
			to: c.simpleContract.address,
			data: setCallData1,
			account: TEST_ACCOUNT,
		})

		// Check first pending update
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
				blockTag: 'pending',
			}),
		).toBe(numberToHex(555, { size: 2 }))

		// Second update
		const setCallData2 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [777n],
		})

		await mc.sendTransaction({
			to: c.simpleContract.address,
			data: setCallData2,
			account: TEST_ACCOUNT,
		})

		// Check second pending update
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
				blockTag: 'pending',
			}),
		).toBe(numberToHex(777, { size: 2 }))

		// Latest block still has original value
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
				blockTag: 'latest',
			}),
		).toBe(numberToHex(420, { size: 2 }))

		// Mine the blocks
		await mc.tevmMine()

		// Now latest has the final value
		expect(
			await mc.getStorageAt({
				address: c.simpleContract.address,
				slot: numberToHex(0),
			}),
		).toBe(numberToHex(777, { size: 2 }))
	})

	it.skip('should handle pending storage changes for newly created contracts', async () => {
		// Deploy a new contract but don't mine
		const deployResult = await mc.tevmDeploy({
			bytecode: SimpleContract.bytecode,
			abi: SimpleContract.abi,
			args: [123n],
		})

		if (!deployResult.createdAddress) {
			throw new Error('contract never deployed')
		}

		const newContractAddress = deployResult.createdAddress

		// Check storage in pending block - should have initial value
		expect(
			await mc.getStorageAt({
				address: newContractAddress,
				slot: numberToHex(0),
				blockTag: 'pending',
			}),
		).toBe(numberToHex(123, { size: 2 }))

		// Latest block shouldn't have the contract yet
		try {
			// This might fail if the contract doesn't exist in the latest block
			await mc.getStorageAt({
				address: newContractAddress,
				slot: numberToHex(0),
			})
		} catch (error) {
			// Expected
		}

		// Update the new contract's storage
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [456n],
		})

		await mc.sendTransaction({
			to: newContractAddress,
			data: setCallData,
			account: TEST_ACCOUNT,
		})

		// Check updated storage in pending block
		expect(
			await mc.getStorageAt({
				address: newContractAddress,
				slot: numberToHex(0),
				blockTag: 'pending',
			}),
		).toBe(numberToHex(456, { size: 2 }))

		// Mine the blocks
		await mc.tevmMine()

		// Now latest block should have the contract with final value
		expect(
			await mc.getStorageAt({
				address: newContractAddress,
				slot: numberToHex(0),
			}),
		).toBe(numberToHex(456, { size: 2 }))
	})
})
