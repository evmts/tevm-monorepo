import { SimpleContract } from '@tevm/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

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

describe('getLogs', () => {
	// this has a bug
	it.todo('should work', async () => {
		const filter = await mc.createEventFilter('eventAbi' as any)
		const logs = await mc.getLogs(filter)
		expect(logs).toHaveLength(0)
	})

	it('should work with blockTag pending', async () => {
		// Create a filter with pending block tag
		const filter = await mc.createEventFilter({
			event: SimpleContract.abi[0],
			fromBlock: 'pending',
		})

		// Get logs with pending block
		const logs = await mc.getLogs(filter)
		expect(logs).toBeDefined()
		expect(Array.isArray(logs)).toBe(true)
	})

	it('should capture logs from pending transactions', async () => {
		// Find the ValueChanged event in the ABI
		const valueChangedEvent = SimpleContract.abi.find(
			(entry) => entry.type === 'event' && entry.name === 'ValueChanged',
		)

		if (!valueChangedEvent) {
			throw new Error('ValueChanged event not found in ABI')
		}

		// Create filters for both latest and pending blocks
		const latestFilter = await mc.createEventFilter({
			event: valueChangedEvent,
			fromBlock: 'latest',
		})

		const pendingFilter = await mc.createEventFilter({
			event: valueChangedEvent,
			fromBlock: 'pending',
		})

		// Send a transaction that emits an event
		const setCallData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [777n],
		})

		await mc.sendTransaction({
			to: mc.deployedContracts[0].address,
			data: setCallData,
			account: '0x1234567890123456789012345678901234567890',
		})

		// Get logs from both filters
		const latestLogs = await mc.getLogs(latestFilter)
		const pendingLogs = await mc.getLogs(pendingFilter)

		// Latest logs should not include the new event since we haven't mined yet
		expect(latestLogs.length).toBe(0)

		// Pending logs should include the new event
		expect(pendingLogs.length).toBeGreaterThan(0)

		// Mine the block
		await mc.tevmMine()

		// Now latest logs should include the event
		const newLatestLogs = await mc.getLogs(latestFilter)
		expect(newLatestLogs.length).toBeGreaterThan(0)
	})

	it('should update pending logs when new transactions are added', async () => {
		// Find the ValueChanged event in the ABI
		const valueChangedEvent = SimpleContract.abi.find(
			(entry) => entry.type === 'event' && entry.name === 'ValueChanged',
		)

		if (!valueChangedEvent) {
			throw new Error('ValueChanged event not found in ABI')
		}

		// Create a pending filter
		const pendingFilter = await mc.createEventFilter({
			event: valueChangedEvent,
			fromBlock: 'pending',
		})

		// Send first transaction
		const setCallData1 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [111n],
		})

		await mc.sendTransaction({
			to: mc.deployedContracts[0].address,
			data: setCallData1,
			account: '0x1234567890123456789012345678901234567890',
		})

		// Get logs after first transaction
		const logs1 = await mc.getLogs(pendingFilter)
		expect(logs1.length).toBeGreaterThan(0)

		// Send second transaction
		const setCallData2 = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [222n],
		})

		await mc.sendTransaction({
			to: mc.deployedContracts[0].address,
			data: setCallData2,
			account: '0x1234567890123456789012345678901234567890',
		})

		// Get logs after second transaction
		const logs2 = await mc.getLogs(pendingFilter)

		// Should have more logs now
		expect(logs2.length).toBeGreaterThan(logs1.length)

		// Mine the transactions
		await mc.tevmMine()

		// Get logs from the mined block
		const latestFilter = await mc.createEventFilter({
			event: valueChangedEvent,
			fromBlock: 'latest',
		})

		const minedLogs = await mc.getLogs(latestFilter)

		// The mined logs should match the pending logs before mining
		expect(minedLogs.length).toBe(logs2.length)
	})
})
