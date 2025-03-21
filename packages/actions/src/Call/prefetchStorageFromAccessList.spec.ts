import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { hexToBytes } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { prefetchStorageFromAccessList } from './prefetchStorageFromAccessList.js'

// Type for 0x-prefixed strings
type HexString = `0x${string}`;

describe('prefetchStorageFromAccessList', () => {
	it('should handle empty or undefined accessList', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()

		// Mock the stateManager.getContractStorage method to track calls
		const getContractStorageSpy = vi.spyOn(vm.stateManager, 'getContractStorage')

		// Test with undefined accessList
		await prefetchStorageFromAccessList(client, undefined)
		expect(getContractStorageSpy).not.toHaveBeenCalled()

		// Test with empty accessList
		await prefetchStorageFromAccessList(client, { accessList: [], gasUsed: "0x0" as HexString })
		expect(getContractStorageSpy).not.toHaveBeenCalled()

		getContractStorageSpy.mockRestore()
	})

	it('should prefetch storage for all slots in the access list', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()

		// Mock the stateManager.getContractStorage method to track calls
		const getContractStorageSpy = vi
			.spyOn(vm.stateManager, 'getContractStorage')
			.mockResolvedValue(Buffer.from('test value'))

		// Create a test access list
		const accessList = {
			accessList: [
				{
					address: '0x1111111111111111111111111111111111111111' as HexString,
					storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001' as HexString]
				},
				{
					address: '0x2222222222222222222222222222222222222222' as HexString,
					storageKeys: [
						'0x0000000000000000000000000000000000000000000000000000000000000002' as HexString,
						'0x0000000000000000000000000000000000000000000000000000000000000003' as HexString
					]
				}
			],
			gasUsed: "0x0" as HexString
		}

		await prefetchStorageFromAccessList(client, accessList)

		// Should have made 3 calls to getContractStorage (one for each storage slot)
		expect(getContractStorageSpy).toHaveBeenCalledTimes(3)

		// Check the first call for address 0x11...11 and storage key 0x01
		expect(getContractStorageSpy).toHaveBeenCalledWith(
			createAddress('0x1111111111111111111111111111111111111111'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 }),
		)

		// Check calls for address 0x22...22 with its two storage keys
		expect(getContractStorageSpy).toHaveBeenCalledWith(
			createAddress('0x2222222222222222222222222222222222222222'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002', { size: 32 }),
		)

		expect(getContractStorageSpy).toHaveBeenCalledWith(
			createAddress('0x2222222222222222222222222222222222222222'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000003', { size: 32 }),
		)

		getContractStorageSpy.mockRestore()
	})

	it('should handle errors during storage fetching', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()

		// Mock debug logger to verify it's called
		const debugSpy = vi.spyOn(client.logger, 'debug').mockImplementation(() => {})

		// Mock getContractStorage to throw an error
		const getContractStorageSpy = vi
			.spyOn(vm.stateManager, 'getContractStorage')
			.mockRejectedValue(new Error('Storage fetch error'))

		// Create a test access list with one entry
		const accessList = {
			accessList: [
				{
					address: '0x1111111111111111111111111111111111111111' as HexString,
					storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001' as HexString]
				}
			],
			gasUsed: "0x0" as HexString
		}

		// Should not throw even though fetching fails
		await prefetchStorageFromAccessList(client, accessList)

		// Debug log should be called for the error
		expect(debugSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				error: expect.any(Error),
				address: '0x1111111111111111111111111111111111111111',
				slot: '0x0000000000000000000000000000000000000000000000000000000000000001'
			}),
			'Error prefetching storage slot'
		)

		// Should log completion info
		expect(debugSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				addressCount: 1,
				slotCount: 1
			}),
			'Completed prefetching storage slots'
		)

		debugSpy.mockRestore()
		getContractStorageSpy.mockRestore()
	})

	it('should handle storage keys with and without 0x prefix', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()

		// Mock the stateManager.getContractStorage method to track calls
		const getContractStorageSpy = vi
			.spyOn(vm.stateManager, 'getContractStorage')
			.mockResolvedValue(Buffer.from('test value'))

		// Create a test access list with mixed prefixes
		const accessList = {
			accessList: [
				{
					address: '0x1111111111111111111111111111111111111111' as HexString,
					storageKeys: [
						'0x0000000000000000000000000000000000000000000000000000000000000001' as HexString, // with 0x
						'0x0000000000000000000000000000000000000000000000000000000000000002' as HexString // Fixed: add 0x prefix
					]
				},
				{
					address: '0x2222222222222222222222222222222222222222' as HexString, // Fixed: add 0x prefix
					storageKeys: [
						'0x0000000000000000000000000000000000000000000000000000000000000003' as HexString
					]
				}
			],
			gasUsed: "0x0" as HexString
		}

		await prefetchStorageFromAccessList(client, accessList)

		// Should have made 3 calls to getContractStorage
		expect(getContractStorageSpy).toHaveBeenCalledTimes(3)

		// All addresses should be properly converted regardless of initial format
		expect(getContractStorageSpy).toHaveBeenCalledWith(
			createAddress('0x1111111111111111111111111111111111111111'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 }),
		)

		expect(getContractStorageSpy).toHaveBeenCalledWith(
			createAddress('0x1111111111111111111111111111111111111111'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002', { size: 32 }),
		)

		expect(getContractStorageSpy).toHaveBeenCalledWith(
			createAddress('0x2222222222222222222222222222222222222222'),
			hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000003', { size: 32 }),
		)

		getContractStorageSpy.mockRestore()
	})
})
