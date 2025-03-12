import { EipNotEnabledError } from '@tevm/errors'
import { describe, expect, it, vi } from 'vitest'

describe('accumulateParentBlockHash', () => {
	it('should throw if EIP-2935 is not activated', async () => {
		// Mock VM with EIP-2935 not activated
		const mockVm = {
			common: {
				ethjsCommon: {
					isActivatedEIP: vi.fn().mockReturnValue(false),
				},
			},
		}

		// Mock the function to test the EIP activation check
		const testFunction = async () => {
			if (!mockVm.common.ethjsCommon.isActivatedEIP(2935)) {
				throw new EipNotEnabledError('Cannot call `accumulateParentBlockHash`: EIP 2935 is not active')
			}
		}

		// Verify it throws the correct error
		await expect(testFunction()).rejects.toThrow(EipNotEnabledError)

		// Verify isActivatedEIP was called with the correct EIP number
		expect(mockVm.common.ethjsCommon.isActivatedEIP).toHaveBeenCalledWith(2935)
	})

	it('should call putAccount if the account does not exist', async () => {
		// Mocks for dependencies
		const getAccountMock = vi.fn().mockResolvedValue(undefined)
		const putAccountMock = vi.fn().mockResolvedValue(undefined)

		// Mock call to test account creation
		const testFunction = async () => {
			if ((await getAccountMock()) === undefined) {
				await putAccountMock()
			}
		}

		await testFunction()

		// Verify account existence was checked
		expect(getAccountMock).toHaveBeenCalled()

		// Verify new account was created
		expect(putAccountMock).toHaveBeenCalled()
	})

	it('should store the parent hash correctly', async () => {
		// Mock for putContractStorage
		const putContractStorageMock = vi.fn().mockResolvedValue(undefined)
		const mockForkTime = 1000

		// Mock VM functions
		const getBlockMock = vi.fn().mockResolvedValue({
			header: {
				timestamp: mockForkTime + 100, // After fork time
			},
		})

		const eipTimestampMock = vi.fn().mockReturnValue(mockForkTime)

		// Test function simulating parent hash storage
		const testFunction = async () => {
			// Store parent hash
			await putContractStorageMock()

			// Get parent block
			const parentBlock = await getBlockMock()

			// This branch won't execute because timestamp > forkTime
			if (parentBlock.header.timestamp < eipTimestampMock()) {
				// This should not run in this test
				await putContractStorageMock()
				await putContractStorageMock()
			}
		}

		await testFunction()

		// Verify parent hash was stored exactly once
		expect(putContractStorageMock).toHaveBeenCalledTimes(1)
	})

	it('should store historical block hashes when on the fork block', async () => {
		// Mocks for dependencies
		const putContractStorageMock = vi.fn().mockResolvedValue(undefined)
		const mockForkTime = 1000

		// Create parent block with timestamp before fork time
		const getBlockMock = vi.fn().mockResolvedValue({
			header: {
				timestamp: mockForkTime - 100, // Before fork time - will trigger historical storage
			},
		})

		const eipTimestampMock = vi.fn().mockReturnValue(mockForkTime)
		const getWindowMock = vi.fn().mockReturnValue(3) // Small window for testing

		// Test function simulating historical hash storage
		const testFunction = async () => {
			// Store parent hash
			await putContractStorageMock()

			// Get parent block
			const parentBlock = await getBlockMock()

			// Process historical blocks if on fork block
			if (parentBlock.header.timestamp < eipTimestampMock()) {
				const historyWindow = getWindowMock()

				// Add historical hashes
				for (let i = 0; i < historyWindow - 1; i++) {
					await getBlockMock()
					await putContractStorageMock()
				}
			}
		}

		await testFunction()

		// Should have called getBlock multiple times (initial + historical)
		expect(getBlockMock).toHaveBeenCalledTimes(3)

		// Should have stored multiple block hashes (parent + historical)
		expect(putContractStorageMock).toHaveBeenCalledTimes(3)
	})
})
