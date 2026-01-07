import type { TestActions } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { testActions } from '../../createClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('snapshot', () => {
	it('should create and revert snapshots', async () => {
		// Get initial balance
		const testAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const initialBalance = await mc.getBalance({ address: testAddress })

		// Create a snapshot
		const snapshotId = await mc.snapshot()
		expect(snapshotId).toBe('0x1')

		// Modify state - set a different balance
		await mc.setBalance({
			address: testAddress,
			value: 12345n,
		})

		// Verify balance changed
		const modifiedBalance = await mc.getBalance({ address: testAddress })
		expect(modifiedBalance).toBe(12345n)

		// Revert to snapshot (viem's revert doesn't return a value)
		await mc.revert({ id: snapshotId })

		// Verify balance is back to original
		const revertedBalance = await mc.getBalance({ address: testAddress })
		expect(revertedBalance).toBe(initialBalance)
	})

	it('should support multiple snapshots', async () => {
		const testAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Create first snapshot
		const snapshot1 = await mc.snapshot()
		expect(snapshot1).toBe('0x1')

		// Modify and create second snapshot
		await mc.setBalance({ address: testAddress, value: 100n })
		const snapshot2 = await mc.snapshot()
		expect(snapshot2).toBe('0x2')

		// Modify again
		await mc.setBalance({ address: testAddress, value: 200n })
		expect(await mc.getBalance({ address: testAddress })).toBe(200n)

		// Revert to snapshot 2
		await mc.revert({ id: snapshot2 })
		expect(await mc.getBalance({ address: testAddress })).toBe(100n)
	})

	it('should handle invalid snapshot id via JSON-RPC', async () => {
		// Test directly via request to check return value
		// @ts-expect-error - evm_revert not in type definitions
		const result = await mc.request({ method: 'evm_revert', params: ['0x999'] })
		expect(result).toBe(false)
	})
})
