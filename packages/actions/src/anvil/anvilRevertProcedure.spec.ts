import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { testAccounts } from '../eth/utils/testAccounts.js'
import { getAccountProcedure } from '../GetAccount/getAccountProcedure.js'
import { requestProcedure } from '../requestProcedure.js'
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

	it('restores pending txpool contents from a snapshot', async () => {
		const client = createTevmNode({ miningConfig: { type: 'manual' } })
		await client.ready()
		const request = requestProcedure(client)
		const from = testAccounts[0].address
		const to = testAccounts[1].address

		await request({
			jsonrpc: '2.0',
			method: 'eth_sendTransaction',
			id: 1,
			params: [{ from, to, value: '0x1', nonce: '0x0' }] as any,
		})
		const snapshot = await request({ jsonrpc: '2.0', method: 'anvil_snapshot', id: 2, params: [] })

		await request({
			jsonrpc: '2.0',
			method: 'eth_sendTransaction',
			id: 3,
			params: [{ from, to, value: '0x2', nonce: '0x1' }] as any,
		})
		let status = await request({ jsonrpc: '2.0', method: 'txpool_status', id: 4 })
		expect(status.result).toEqual({ pending: '0x2', queued: '0x0' })

		const revert = await request({ jsonrpc: '2.0', method: 'anvil_revert', id: 5, params: [snapshot.result] as any })
		expect(revert.result).toBe(true)

		status = await request({ jsonrpc: '2.0', method: 'txpool_status', id: 6 })
		expect(status.result).toEqual({ pending: '0x1', queued: '0x0' })
		const content = await request({ jsonrpc: '2.0', method: 'txpool_content', id: 7 })
		const sender = Object.keys(content.result.pending)[0] as string
		expect(Object.keys(content.result.pending[sender])).toEqual(['0x0'])
	})

	it('restores local chain head and receipt indexes from a snapshot', async () => {
		const client = createTevmNode()
		await client.ready()
		const request = requestProcedure(client)
		const from = testAccounts[0].address
		const to = testAccounts[1].address

		const firstTx = await request({
			jsonrpc: '2.0',
			method: 'eth_sendTransaction',
			id: 1,
			params: [{ from, to, value: '0x1', nonce: '0x0' }] as any,
		})
		const firstReceipt = await request({
			jsonrpc: '2.0',
			method: 'eth_getTransactionReceipt',
			id: 2,
			params: [firstTx.result] as any,
		})
		expect(firstReceipt.result?.transactionHash).toBe(firstTx.result)
		const headAfterFirst = await request({ jsonrpc: '2.0', method: 'eth_blockNumber', id: 3 })
		const snapshot = await request({ jsonrpc: '2.0', method: 'anvil_snapshot', id: 4, params: [] })

		const secondTx = await request({
			jsonrpc: '2.0',
			method: 'eth_sendTransaction',
			id: 5,
			params: [{ from, to, value: '0x2', nonce: '0x1' }] as any,
		})
		const secondReceipt = await request({
			jsonrpc: '2.0',
			method: 'eth_getTransactionReceipt',
			id: 6,
			params: [secondTx.result] as any,
		})
		expect(secondReceipt.result?.transactionHash).toBe(secondTx.result)
		const headAfterSecond = await request({ jsonrpc: '2.0', method: 'eth_blockNumber', id: 7 })
		expect(headAfterSecond.result).not.toBe(headAfterFirst.result)

		const revert = await request({ jsonrpc: '2.0', method: 'anvil_revert', id: 8, params: [snapshot.result] as any })
		expect(revert.result).toBe(true)
		const headAfterRevert = await request({ jsonrpc: '2.0', method: 'eth_blockNumber', id: 9 })
		expect(headAfterRevert.result).toBe(headAfterFirst.result)
		const firstReceiptAfterRevert = await request({
			jsonrpc: '2.0',
			method: 'eth_getTransactionReceipt',
			id: 10,
			params: [firstTx.result] as any,
		})
		expect(firstReceiptAfterRevert.result?.transactionHash).toBe(firstTx.result)
		const secondReceiptAfterRevert = await request({
			jsonrpc: '2.0',
			method: 'eth_getTransactionReceipt',
			id: 11,
			params: [secondTx.result] as any,
		})
		expect(secondReceiptAfterRevert.result).toBeNull()
	})

	it('restores mining, block environment, impersonation, and time controls', async () => {
		const client = createTevmNode({ miningConfig: { type: 'manual' } })
		const snapshotProcedure = anvilSnapshotJsonRpcProcedure(client)
		const revertProcedure = anvilRevertJsonRpcProcedure(client)

		client.miningConfig = { type: 'interval', blockTime: 7 }
		client.setAutoImpersonate(true)
		client.setImpersonatedAccount(testAccounts[1].address)
		client.setNextBlockTimestamp(123n)
		client.setNextBlockGasLimit(30_000_001n)
		client.setNextBlockBaseFeePerGas(100n)
		client.setNextBlockPrevRandao(456n)
		client.setMinGasPrice(789n)
		client.setBlockTimestampInterval(12n)

		const snapshot = await snapshotProcedure({
			jsonrpc: '2.0',
			method: 'anvil_snapshot',
			params: [],
			id: 1,
		})

		client.miningConfig = { type: 'manual' }
		client.setAutoImpersonate(false)
		client.setImpersonatedAccount(undefined)
		client.setNextBlockTimestamp(undefined)
		client.setNextBlockGasLimit(undefined)
		client.setNextBlockBaseFeePerGas(undefined)
		client.setNextBlockPrevRandao(undefined)
		client.setMinGasPrice(undefined)
		client.setBlockTimestampInterval(undefined)

		const revert = await revertProcedure({
			jsonrpc: '2.0',
			method: 'anvil_revert',
			params: [snapshot.result],
			id: 2,
		})
		expect(revert.result).toBe(true)
		expect(client.miningConfig).toEqual({ type: 'interval', blockTime: 7 })
		expect(client.getAutoImpersonate()).toBe(true)
		expect(client.getImpersonatedAccount()).toBe(testAccounts[1].address)
		expect(client.getNextBlockTimestamp()).toBe(123n)
		expect(client.getNextBlockGasLimit()).toBe(30_000_001n)
		expect(client.getNextBlockBaseFeePerGas()).toBe(100n)
		expect(client.getNextBlockPrevRandao()).toBe(456n)
		expect(client.getMinGasPrice()).toBe(789n)
		expect(client.getBlockTimestampInterval()).toBe(12n)
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
