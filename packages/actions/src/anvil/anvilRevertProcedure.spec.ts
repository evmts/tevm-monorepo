import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getAccountProcedure } from '../GetAccount/getAccountProcedure.js'
import { anvilRevertJsonRpcProcedure } from './anvilRevertProcedure.js'
import { anvilSetBalanceJsonRpcProcedure } from './anvilSetBalanceProcedure.js'
import { anvilSnapshotJsonRpcProcedure } from './anvilSnapshotProcedure.js'

describe('anvilRevertJsonRpcProcedure', () => {
	it('should revert to a previous snapshot', async () => {
		const client = createTevmNode()
		const snapshotProcedure = anvilSnapshotJsonRpcProcedure(client)
		const revertProcedure = anvilRevertJsonRpcProcedure(client)
		const setBalanceProcedure = anvilSetBalanceJsonRpcProcedure(client)
		const getAccountProc = getAccountProcedure(client)
		const address = createAddress('0x1234567890123456789012345678901234567890')

		// Set initial balance
		await setBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(parseEther('100'))],
			id: 1,
		})

		// Create snapshot
		const snapshotResult = await snapshotProcedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 2,
		})

		const snapshotId = snapshotResult.result

		// Change balance
		await setBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(parseEther('200'))],
			id: 3,
		})

		// Verify balance changed
		const accountAfterChange = await getAccountProc({
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			params: [{ address: address.toString() }],
			id: 4,
		})

		expect(accountAfterChange.result?.balance).toBe(numberToHex(parseEther('200')))

		// Revert to snapshot
		const revertResult = await revertProcedure({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			params: [snapshotId],
			id: 5,
		})

		expect(revertResult).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			result: true,
			id: 5,
		})

		// Verify balance reverted
		const accountAfterRevert = await getAccountProc({
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			params: [{ address: address.toString() }],
			id: 6,
		})

		expect(accountAfterRevert.result?.balance).toBe(numberToHex(parseEther('100')))
	})

	it('should return false for non-existent snapshot', async () => {
		const client = createTevmNode()
		const revertProcedure = anvilRevertJsonRpcProcedure(client)

		const result = await revertProcedure({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			params: ['0x999'],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			result: false,
			id: 1,
		})
	})

	it('should delete snapshots after revert', async () => {
		const client = createTevmNode()
		const snapshotProcedure = anvilSnapshotJsonRpcProcedure(client)
		const revertProcedure = anvilRevertJsonRpcProcedure(client)
		const setBalanceProcedure = anvilSetBalanceJsonRpcProcedure(client)
		const address = createAddress('0x1234567890123456789012345678901234567890')

		// Set initial balance and create snapshot 1
		await setBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(parseEther('100'))],
			id: 1,
		})

		const snapshot1 = await snapshotProcedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 2,
		})

		// Change balance and create snapshot 2
		await setBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(parseEther('200'))],
			id: 3,
		})

		const snapshot2 = await snapshotProcedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 4,
		})

		// Change balance and create snapshot 3
		await setBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(parseEther('300'))],
			id: 5,
		})

		const snapshot3 = await snapshotProcedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 6,
		})

		// Verify we have 3 snapshots
		expect(client.getSnapshots().size).toBe(3)

		// Revert to snapshot 2
		await revertProcedure({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			params: [snapshot2.result],
			id: 7,
		})

		// Snapshot 2 and 3 should be deleted, only snapshot 1 remains
		const snapshots = client.getSnapshots()
		expect(snapshots.size).toBe(1)
		expect(snapshots.has(snapshot1.result)).toBe(true)
		expect(snapshots.has(snapshot2.result)).toBe(false)
		expect(snapshots.has(snapshot3.result)).toBe(false)
	})

	it('should handle requests without an id', async () => {
		const client = createTevmNode()
		const snapshotProcedure = anvilSnapshotJsonRpcProcedure(client)
		const revertProcedure = anvilRevertJsonRpcProcedure(client)

		// Create snapshot
		const snapshotResult = await snapshotProcedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
		})

		const result = await revertProcedure({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			params: [snapshotResult.result],
		})

		expect(result).toMatchObject({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			result: true,
		})
		expect(result).not.toHaveProperty('id')
	})
})
