import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { anvilSetBalanceJsonRpcProcedure } from './anvilSetBalanceProcedure.js'
import { anvilSnapshotJsonRpcProcedure } from './anvilSnapshotProcedure.js'

describe('anvilSnapshotJsonRpcProcedure', () => {
	it('should create a snapshot and return a snapshot ID', async () => {
		const client = createTevmNode()
		const procedure = anvilSnapshotJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 1,
		})

		expect(result).toMatchObject({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			id: 1,
		})
		expect(result.result).toMatch(/^0x[0-9a-f]+$/)
		expect(result.result).toBe('0x1')
	})

	it('should create multiple snapshots with incremental IDs', async () => {
		const client = createTevmNode()
		const procedure = anvilSnapshotJsonRpcProcedure(client)

		const result1 = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 1,
		})

		const result2 = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 2,
		})

		const result3 = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 3,
		})

		expect(result1.result).toBe('0x1')
		expect(result2.result).toBe('0x2')
		expect(result3.result).toBe('0x3')
	})

	it('should handle requests without an id', async () => {
		const client = createTevmNode()
		const procedure = anvilSnapshotJsonRpcProcedure(client)

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
		})

		expect(result).toMatchObject({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
		})
		expect(result.result).toMatch(/^0x[0-9a-f]+$/)
		expect(result).not.toHaveProperty('id')
	})

	it('should capture state at the time of snapshot', async () => {
		const client = createTevmNode()
		const snapshotProcedure = anvilSnapshotJsonRpcProcedure(client)
		const setBalanceProcedure = anvilSetBalanceJsonRpcProcedure(client)
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

		expect(snapshotResult.result).toBe('0x1')

		// Verify snapshot was stored
		const snapshots = client.getSnapshots()
		expect(snapshots.size).toBe(1)
		expect(snapshots.has('0x1')).toBe(true)

		const snapshot = snapshots.get('0x1')
		expect(snapshot).toBeDefined()
		expect(snapshot?.stateRoot).toBeDefined()
		expect(snapshot?.state).toBeDefined()
	})
})
