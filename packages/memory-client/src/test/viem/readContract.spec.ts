import { SimpleContract } from '@tevm/test-utils'
import { encodeDeployData, encodeFunctionData, numberToHex, parseEther } from 'viem'
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

describe('readContract', () => {
	it('should work as script', async () => {
		expect(SimpleContract.bytecode).not.toBe(SimpleContract.deployedBytecode)
		const code = encodeDeployData(SimpleContract.deploy(42n))
		expect(
			await mc.call({
				code,
				data: encodeFunctionData(SimpleContract.read.get()),
			}),
		).toEqual({ data: numberToHex(42n, { size: 32 }) })
		// expect(await mc.readContract(SimpleContract.readDeployless.get())).toBe(0n)
	})

	it('should work as call', async () => {
		const { to } = c.simpleContract.read.get()
		expect(to).toBe(c.simpleContract.address)
		expect(to).toBeDefined()
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)
	})

	it.skip('should work with blockTag pending', async () => {
		// First read the current value
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)

		// Now set a new value but don't mine the block
		await mc.writeContract({
			...c.simpleContract.write.set([999n]),
			account: TEST_ACCOUNT,
		})

		// Read with latest block tag - should still be the old value
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)

		// Read with pending block tag - should be the new value
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'pending',
			}),
		).toBe(999n)
	})

	it.skip('should handle multiple pending transactions in sequence', async () => {
		// Initial value check
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)

		// First transaction - set to 500
		await mc.writeContract({
			...c.simpleContract.write.set([500n]),
			account: TEST_ACCOUNT,
		})

		// Check pending state after first transaction
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'pending',
			}),
		).toBe(500n)

		// Second transaction - set to 600
		await mc.writeContract({
			...c.simpleContract.write.set([600n]),
			account: TEST_ACCOUNT,
		})

		// Check pending state after second transaction
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'pending',
			}),
		).toBe(600n)

		// Latest block should still show original value
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'latest',
			}),
		).toBe(420n)

		// Mine the transactions
		await mc.tevmMine()

		// After mining, latest block should show the final value
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(600n)
	})

	it.skip('should correctly revert to unmined state when a transaction fails', async () => {
		// First read the current value
		expect(await mc.readContract(c.simpleContract.read.get())).toBe(420n)

		// Send a successful transaction but don't mine it
		await mc.writeContract({
			...c.simpleContract.write.set([777n]),
			account: TEST_ACCOUNT,
		})

		// Pending state should reflect the new value
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'pending',
			}),
		).toBe(777n)

		try {
			// Try to send a transaction that will fail (SimpleContract doesn't have a failing method,
			// so we'll simulate with an invalid function call)
			await mc.call({
				to: c.simpleContract.address,
				data: '0xdeadbeef', // Invalid function selector
				createTransaction: true,
				account: TEST_ACCOUNT,
			})
		} catch (error) {
			// Expected to fail
		}

		// Pending state should still reflect the successful transaction's value
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'pending',
			}),
		).toBe(777n)

		// Latest should still be the original value
		expect(
			await mc.readContract({
				...c.simpleContract.read.get(),
				blockTag: 'latest',
			}),
		).toBe(420n)
	})
})
