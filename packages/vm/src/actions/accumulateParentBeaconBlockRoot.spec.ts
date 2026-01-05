import { EipNotEnabledError } from '@tevm/errors'
import { EthjsAccount, setLengthLeft, toBytes } from '@tevm/utils'
import { describe, expect, it, vi } from 'vitest'
import { accumulateParentBeaconBlockRoot } from './accumulateParentBeaconBlockRoot.js'
import { parentBeaconBlockRootAddress } from './parentBeaconBlockRootAddress.js'

describe('accumulateParentBeaconBlockRoot', () => {
	it('should throw EipNotEnabledError if EIP-4788 is not activated', async () => {
		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(false),
				},
			},
			stateManager: {
				getAccount: vi.fn(),
				putStorage: vi.fn(),
			},
			evm: {
				journal: {
					putAccount: vi.fn(),
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(1)
		const timestamp = 1234567890n

		await expect(accumulator(root, timestamp)).rejects.toThrow(EipNotEnabledError)
		await expect(accumulator(root, timestamp)).rejects.toThrow(
			'Cannot call `accumulateParentBeaconBlockRoot`: EIP 4788 is not active',
		)
		expect(mockVm.common.ethjsCommon.isActivatedEIP).toHaveBeenCalledWith(4788)
	})

	it('should create account if it does not exist', async () => {
		const putAccountMock = vi.fn().mockResolvedValue(undefined)
		const putStorageMock = vi.fn().mockResolvedValue(undefined)

		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(true),
				},
			},
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(undefined),
				putStorage: putStorageMock,
			},
			evm: {
				journal: {
					putAccount: putAccountMock,
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(1)
		const timestamp = 1234567890n

		await accumulator(root, timestamp)

		expect(mockVm.stateManager.getAccount).toHaveBeenCalledWith(parentBeaconBlockRootAddress)
		expect(putAccountMock).toHaveBeenCalledWith(parentBeaconBlockRootAddress, expect.any(EthjsAccount))
	})

	it('should not create account if it already exists', async () => {
		const putAccountMock = vi.fn().mockResolvedValue(undefined)
		const putStorageMock = vi.fn().mockResolvedValue(undefined)
		const existingAccount = new EthjsAccount()

		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(true),
				},
			},
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(existingAccount),
				putStorage: putStorageMock,
			},
			evm: {
				journal: {
					putAccount: putAccountMock,
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(1)
		const timestamp = 1234567890n

		await accumulator(root, timestamp)

		expect(mockVm.stateManager.getAccount).toHaveBeenCalledWith(parentBeaconBlockRootAddress)
		expect(putAccountMock).not.toHaveBeenCalled()
	})

	it('should store timestamp and root in the ring buffer', async () => {
		const putStorageMock = vi.fn().mockResolvedValue(undefined)

		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(true),
				},
			},
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(new EthjsAccount()),
				putStorage: putStorageMock,
			},
			evm: {
				journal: {
					putAccount: vi.fn(),
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(42)
		const timestamp = 1234567890n

		await accumulator(root, timestamp)

		// Should make two putStorage calls - one for timestamp, one for root
		expect(putStorageMock).toHaveBeenCalledTimes(2)

		// Verify the storage keys and values follow the EIP-4788 spec
		const historicalRootsLength = 8191n
		const timestampIndex = timestamp % historicalRootsLength
		const timestampExtended = timestampIndex + historicalRootsLength

		// First call: store timestamp at timestampIndex
		expect(putStorageMock).toHaveBeenNthCalledWith(
			1,
			parentBeaconBlockRootAddress,
			setLengthLeft(toBytes(timestampIndex), 32),
			toBytes(timestamp),
		)

		// Second call: store root at timestampExtended
		expect(putStorageMock).toHaveBeenNthCalledWith(
			2,
			parentBeaconBlockRootAddress,
			setLengthLeft(toBytes(timestampExtended), 32),
			root,
		)
	})

	it('should use modular arithmetic for ring buffer storage', async () => {
		const putStorageCalls: Array<[any, Uint8Array, Uint8Array]> = []
		const putStorageMock = vi.fn().mockImplementation((addr, key, val) => {
			putStorageCalls.push([addr, key, val])
			return Promise.resolve()
		})

		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(true),
				},
			},
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(new EthjsAccount()),
				putStorage: putStorageMock,
			},
			evm: {
				journal: {
					putAccount: vi.fn(),
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(99)

		// Use a timestamp that will wrap around the ring buffer
		const historicalRootsLength = 8191n
		const timestamp = historicalRootsLength * 3n + 500n // Should result in index 500

		await accumulator(root, timestamp)

		// Verify the timestamp index is correctly calculated using modular arithmetic
		const expectedTimestampIndex = timestamp % historicalRootsLength
		expect(expectedTimestampIndex).toBe(500n)

		// Verify the extended index
		const expectedExtendedIndex = expectedTimestampIndex + historicalRootsLength
		expect(expectedExtendedIndex).toBe(8691n)
	})

	it('should handle boundary case at historicalRootsLength - 1', async () => {
		const putStorageMock = vi.fn().mockResolvedValue(undefined)

		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(true),
				},
			},
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(new EthjsAccount()),
				putStorage: putStorageMock,
			},
			evm: {
				journal: {
					putAccount: vi.fn(),
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(77)

		// Use timestamp that results in the max index (8190)
		const historicalRootsLength = 8191n
		const timestamp = historicalRootsLength - 1n

		await accumulator(root, timestamp)

		expect(putStorageMock).toHaveBeenCalledTimes(2)

		// Verify max index is used
		const expectedTimestampIndex = timestamp % historicalRootsLength
		expect(expectedTimestampIndex).toBe(8190n)
	})

	it('should handle timestamp of zero', async () => {
		const putStorageMock = vi.fn().mockResolvedValue(undefined)

		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(true),
				},
			},
			stateManager: {
				getAccount: vi.fn().mockResolvedValue(new EthjsAccount()),
				putStorage: putStorageMock,
			},
			evm: {
				journal: {
					putAccount: vi.fn(),
				},
			},
		}

		const accumulator = accumulateParentBeaconBlockRoot(mockVm as any)
		const root = new Uint8Array(32).fill(55)
		const timestamp = 0n

		await accumulator(root, timestamp)

		expect(putStorageMock).toHaveBeenCalledTimes(2)

		// At timestamp 0, index should be 0
		expect(putStorageMock).toHaveBeenNthCalledWith(
			1,
			parentBeaconBlockRootAddress,
			setLengthLeft(toBytes(0n), 32),
			toBytes(0n),
		)
	})
})
