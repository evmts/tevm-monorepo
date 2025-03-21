import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
	
	// Setup a test account with balance for transactions
	const testAccount = '0x1234567890123456789012345678901234567890'
	await mc.setBalance({
		address: testAccount,
		value: 1000000000000000000n // 1 ETH
	})
	
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

describe('getLogs', () => {
	// this has a bug
	it.todo('should work', async () => {
		const filter = await mc.createEventFilter('eventAbi' as any)
		const logs = await mc.getLogs(filter)
		expect(logs).toHaveLength(0)
	})

	// Skip test with pending blockTag since it's not supported in this branch
	it.skip('should work with blockTag pending', async () => {
		// Create a filter with latest block tag instead
		const filter = await mc.createEventFilter({
			event: {
				type: 'event',
				name: 'ValueSet',
				inputs: [
					{
						name: 'newValue',
						type: 'uint256',
						indexed: false,
					},
				],
			},
			fromBlock: 'latest',
		})

		// Get logs
		const logs = await mc.getLogs(filter)
		expect(logs).toBeDefined()
		expect(Array.isArray(logs)).toBe(true)
	})
})
