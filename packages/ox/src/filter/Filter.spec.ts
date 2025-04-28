import { Effect } from 'effect'
import * as OxFilter from 'ox/execution/filter'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as Filter from './Filter.js'

// Mock the OxFilter module
vi.mock('ox/execution/filter', () => {
	return {
		createFilter: vi.fn(),
		getFilterChanges: vi.fn(),
		uninstallFilter: vi.fn(),
		getFilterLogs: vi.fn(),
	}
})

describe('Filter', () => {
	const mockCreateFilter = OxFilter.createFilter as vi.Mock
	const mockGetFilterChanges = OxFilter.getFilterChanges as vi.Mock
	const mockUninstallFilter = OxFilter.uninstallFilter as vi.Mock
	const mockGetFilterLogs = OxFilter.getFilterLogs as vi.Mock

	beforeEach(() => {
		vi.resetAllMocks()
	})

	describe('createFilter', () => {
		it('should create a filter', async () => {
			const params = {
				fromBlock: 'latest',
				toBlock: 'latest',
				address: '0x1234567890123456789012345678901234567890',
			}
			const expectedFilter = {
				id: '0x1',
				type: 'log',
			}

			mockCreateFilter.mockReturnValue(expectedFilter)

			const result = await Effect.runPromise(Filter.createFilter(params))

			expect(result).toEqual(expectedFilter)
			expect(mockCreateFilter).toHaveBeenCalledWith(params)
		})

		it('should handle errors', async () => {
			const params = {
				fromBlock: 'latest',
				toBlock: 'latest',
				address: '0x1234567890123456789012345678901234567890',
			}
			const error = new Error('Filter creation error')

			mockCreateFilter.mockImplementation(() => {
				throw error
			})

			const program = Filter.createFilter(params)

			await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Filter.CreateFilterError)
			await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
		})
	})

	describe('getFilterChanges', () => {
		it('should get filter changes', async () => {
			const filterId = '0x1'
			const expectedChanges = [
				{
					address: '0x1234567890123456789012345678901234567890',
					blockHash: '0xabcdef',
					blockNumber: 100n,
					data: '0x',
					logIndex: 0n,
					removed: false,
					topics: ['0x123'],
					transactionHash: '0xdef',
					transactionIndex: 0n,
				},
			]

			mockGetFilterChanges.mockReturnValue(expectedChanges)

			const result = await Effect.runPromise(Filter.getFilterChanges(filterId))

			expect(result).toEqual(expectedChanges)
			expect(mockGetFilterChanges).toHaveBeenCalledWith(filterId)
		})

		it('should handle errors', async () => {
			const filterId = '0x1'
			const error = new Error('Get filter changes error')

			mockGetFilterChanges.mockImplementation(() => {
				throw error
			})

			const program = Filter.getFilterChanges(filterId)

			await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Filter.GetFilterChangesError)
			await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
		})
	})

	describe('uninstallFilter', () => {
		it('should uninstall a filter', async () => {
			const filterId = '0x1'
			const expectedResult = true

			mockUninstallFilter.mockReturnValue(expectedResult)

			const result = await Effect.runPromise(Filter.uninstallFilter(filterId))

			expect(result).toBe(expectedResult)
			expect(mockUninstallFilter).toHaveBeenCalledWith(filterId)
		})

		it('should handle errors', async () => {
			const filterId = '0x1'
			const error = new Error('Uninstall filter error')

			mockUninstallFilter.mockImplementation(() => {
				throw error
			})

			const program = Filter.uninstallFilter(filterId)

			await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Filter.UninstallFilterError)
			await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
		})
	})

	describe('getFilterLogs', () => {
		it('should get filter logs', async () => {
			const filterId = '0x1'
			const expectedLogs = [
				{
					address: '0x1234567890123456789012345678901234567890',
					blockHash: '0xabcdef',
					blockNumber: 100n,
					data: '0x',
					logIndex: 0n,
					removed: false,
					topics: ['0x123'],
					transactionHash: '0xdef',
					transactionIndex: 0n,
				},
			]

			mockGetFilterLogs.mockReturnValue(expectedLogs)

			const result = await Effect.runPromise(Filter.getFilterLogs(filterId))

			expect(result).toEqual(expectedLogs)
			expect(mockGetFilterLogs).toHaveBeenCalledWith(filterId)
		})

		it('should handle errors', async () => {
			const filterId = '0x1'
			const error = new Error('Get filter logs error')

			mockGetFilterLogs.mockImplementation(() => {
				throw error
			})

			const program = Filter.getFilterLogs(filterId)

			await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(Filter.GetFilterLogsError)
			await expect(Effect.runPromise(program)).rejects.toHaveProperty('cause', error)
		})
	})
})
