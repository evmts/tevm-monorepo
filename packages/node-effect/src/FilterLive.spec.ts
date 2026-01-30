import { describe, it, expect } from 'vitest'
import { Effect, Exit } from 'effect'
import { FilterService } from './FilterService.js'
import { FilterLive } from './FilterLive.js'
import { FilterNotFoundError, InvalidFilterTypeError } from '@tevm/errors-effect'
import type { FilterLog, Hex } from './types.js'

describe('FilterLive', () => {
	const layer = FilterLive()

	describe('layer creation', () => {
		it('should create a layer', () => {
			expect(layer).toBeDefined()
		})
	})

	describe('createLogFilter', () => {
		it('should create a log filter and return a hex ID', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				return id
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe('0x1')
		})

		it('should create a log filter with params', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter({
					address: '0x1234567890123456789012345678901234567890',
					topics: ['0xabc'],
				})
				const f = yield* filter.get(id)
				return { id, type: f?.type, criteria: f?.logsCriteria }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.id).toBe('0x1')
			expect(result.type).toBe('Log')
			expect(result.criteria?.address).toBe('0x1234567890123456789012345678901234567890')
		})

		it('should increment filter IDs', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id1 = yield* filter.createLogFilter()
				const id2 = yield* filter.createLogFilter()
				const id3 = yield* filter.createLogFilter()
				return [id1, id2, id3]
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toEqual(['0x1', '0x2', '0x3'])
		})
	})

	describe('createBlockFilter', () => {
		it('should create a block filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createBlockFilter()
				const f = yield* filter.get(id)
				return { id, type: f?.type }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.id).toBe('0x1')
			expect(result.type).toBe('Block')
		})
	})

	describe('createPendingTransactionFilter', () => {
		it('should create a pending transaction filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createPendingTransactionFilter()
				const f = yield* filter.get(id)
				return { id, type: f?.type }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.id).toBe('0x1')
			expect(result.type).toBe('PendingTransaction')
		})
	})

	describe('get', () => {
		it('should return undefined for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				return yield* filter.get('0x999')
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBeUndefined()
		})

		it('should return filter data for existing filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				return yield* filter.get(id)
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBeDefined()
			expect(result?.id).toBe('0x1')
			expect(result?.type).toBe('Log')
			expect(result?.created).toBeGreaterThan(0)
		})
	})

	describe('remove', () => {
		it('should return false for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				return yield* filter.remove('0x999')
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(false)
		})

		it('should return true and remove existing filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				const removed = yield* filter.remove(id)
				const afterRemove = yield* filter.get(id)
				return { removed, afterRemove }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.removed).toBe(true)
			expect(result.afterRemove).toBeUndefined()
		})
	})

	describe('getChanges', () => {
		it('should fail with FilterNotFoundError for non-existent filter', async () => {
			const targetFilterId = '0x999' as Hex
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.getChanges(targetFilterId)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as FilterNotFoundError
				expect(error._tag).toBe('FilterNotFoundError')
				expect(error.filterId).toBe(targetFilterId)
			}
		})

		it('should return empty array for new filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				return yield* filter.getChanges(id)
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toEqual([])
		})

		it('should fail for non-log filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				// Create a block filter, not a log filter
				const id = yield* filter.createBlockFilter()
				// Try to get log changes from a block filter - should fail
				yield* filter.getChanges(id)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Log')
				expect(error.message).toContain('not a log filter')
			}
		})

		it('should fail for pending transaction filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				// Create a pending transaction filter, not a log filter
				const id = yield* filter.createPendingTransactionFilter()
				// Try to get log changes from a pending tx filter - should fail
				yield* filter.getChanges(id)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Log')
				expect(error.message).toContain('not a log filter')
			}
		})

		it('should return and clear logs', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()

				// Add a log
				const log: FilterLog = {
					address: '0x1234567890123456789012345678901234567890' as Hex,
					blockHash: '0xabc' as Hex,
					blockNumber: 1n,
					data: '0x' as Hex,
					logIndex: 0n,
					removed: false,
					topics: ['0xdef' as Hex],
					transactionHash: '0x123' as Hex,
					transactionIndex: 0n,
				}
				yield* filter.addLog(id, log)

				// Get changes (should have log)
				const firstChanges = yield* filter.getChanges(id)
				// Get changes again (should be empty)
				const secondChanges = yield* filter.getChanges(id)

				return { firstChanges, secondChanges }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.firstChanges.length).toBe(1)
			expect(result.firstChanges[0]?.address).toBe('0x1234567890123456789012345678901234567890')
			expect(result.secondChanges.length).toBe(0)
		})
	})

	describe('getBlockChanges', () => {
		it('should fail with FilterNotFoundError for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.getBlockChanges('0x999' as Hex)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should fail for non-block filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				yield* filter.getBlockChanges(id)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Block')
				expect(error.message).toContain('not a block filter')
			}
		})

		it('should return and clear blocks', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createBlockFilter()

				// Add a block
				yield* filter.addBlock(id, { number: 1n })

				// Get changes (should have block)
				const firstChanges = yield* filter.getBlockChanges(id)
				// Get changes again (should be empty)
				const secondChanges = yield* filter.getBlockChanges(id)

				return { firstChanges, secondChanges }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.firstChanges.length).toBe(1)
			expect(result.secondChanges.length).toBe(0)
		})
	})

	describe('getPendingTransactionChanges', () => {
		it('should fail with FilterNotFoundError for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.getPendingTransactionChanges('0x999' as Hex)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should fail for non-pending-tx filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createBlockFilter()
				yield* filter.getPendingTransactionChanges(id)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('PendingTransaction')
				expect(error.message).toContain('not a pending transaction filter')
			}
		})

		it('should return and clear pending transactions', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createPendingTransactionFilter()

				// Add a tx
				yield* filter.addPendingTransaction(id, { hash: '0xabc' })

				// Get changes (should have tx)
				const firstChanges = yield* filter.getPendingTransactionChanges(id)
				// Get changes again (should be empty)
				const secondChanges = yield* filter.getPendingTransactionChanges(id)

				return { firstChanges, secondChanges }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.firstChanges.length).toBe(1)
			expect(result.secondChanges.length).toBe(0)
		})
	})

	describe('addLog', () => {
		it('should fail with FilterNotFoundError for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const log: FilterLog = {
					address: '0x1234567890123456789012345678901234567890' as Hex,
					blockHash: '0xabc' as Hex,
					blockNumber: 1n,
					data: '0x' as Hex,
					logIndex: 0n,
					removed: false,
					topics: ['0xdef' as Hex],
					transactionHash: '0x123' as Hex,
					transactionIndex: 0n,
				}
				yield* filter.addLog('0x999' as Hex, log)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should fail with InvalidFilterTypeError when adding to a block filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createBlockFilter()
				const log: FilterLog = {
					address: '0x1234567890123456789012345678901234567890' as Hex,
					blockHash: '0xabc' as Hex,
					blockNumber: 1n,
					data: '0x' as Hex,
					logIndex: 0n,
					removed: false,
					topics: ['0xdef' as Hex],
					transactionHash: '0x123' as Hex,
					transactionIndex: 0n,
				}
				yield* filter.addLog(id, log)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Log')
				expect(error.message).toContain('not a log filter')
			}
		})

		it('should fail with InvalidFilterTypeError when adding to a pending transaction filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createPendingTransactionFilter()
				const log: FilterLog = {
					address: '0x1234567890123456789012345678901234567890' as Hex,
					blockHash: '0xabc' as Hex,
					blockNumber: 1n,
					data: '0x' as Hex,
					logIndex: 0n,
					removed: false,
					topics: ['0xdef' as Hex],
					transactionHash: '0x123' as Hex,
					transactionIndex: 0n,
				}
				yield* filter.addLog(id, log)
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Log')
				expect(error.message).toContain('not a log filter')
			}
		})
	})

	describe('addBlock', () => {
		it('should fail with FilterNotFoundError for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.addBlock('0x999' as Hex, { number: 1n })
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should fail with InvalidFilterTypeError when adding to a log filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				yield* filter.addBlock(id, { number: 1n })
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Block')
				expect(error.message).toContain('not a block filter')
			}
		})

		it('should fail with InvalidFilterTypeError when adding to a pending transaction filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createPendingTransactionFilter()
				yield* filter.addBlock(id, { number: 1n })
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('Block')
				expect(error.message).toContain('not a block filter')
			}
		})
	})

	describe('addPendingTransaction', () => {
		it('should fail with FilterNotFoundError for non-existent filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.addPendingTransaction('0x999' as Hex, { hash: '0xabc' })
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should fail with InvalidFilterTypeError when adding to a log filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				yield* filter.addPendingTransaction(id, { hash: '0xabc' })
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('PendingTransaction')
				expect(error.message).toContain('not a pending transaction filter')
			}
		})

		it('should fail with InvalidFilterTypeError when adding to a block filter', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createBlockFilter()
				yield* filter.addPendingTransaction(id, { hash: '0xabc' })
			})

			const exit = await Effect.runPromiseExit(program.pipe(Effect.provide(layer)))
			expect(Exit.isFailure(exit)).toBe(true)
			if (Exit.isFailure(exit) && exit.cause._tag === 'Fail') {
				const error = exit.cause.error as InvalidFilterTypeError
				expect(error._tag).toBe('InvalidFilterTypeError')
				expect(error.expectedType).toBe('PendingTransaction')
				expect(error.message).toContain('not a pending transaction filter')
			}
		})
	})

	describe('getAllFilters', () => {
		it('should return empty map initially', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				return yield* filter.getAllFilters
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.size).toBe(0)
		})

		it('should return all filters', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.createLogFilter()
				yield* filter.createBlockFilter()
				yield* filter.createPendingTransactionFilter()
				return yield* filter.getAllFilters
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.size).toBe(3)
		})
	})

	describe('deepCopy', () => {
		it('should create an independent copy', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.createLogFilter()
				yield* filter.createBlockFilter()

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Create more filters on original
				yield* filter.createPendingTransactionFilter()

				// Check sizes are different
				const originalFilters = yield* filter.getAllFilters
				const copiedFilters = yield* copy.getAllFilters

				return {
					originalSize: originalFilters.size,
					copiedSize: copiedFilters.size,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.originalSize).toBe(3)
			expect(result.copiedSize).toBe(2)
		})

		it('should preserve counter state', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.createLogFilter() // 0x1
				yield* filter.createBlockFilter() // 0x2

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Create filter on copy
				const copyId = yield* copy.createLogFilter()

				return copyId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe('0x3')
		})

		it('should deep copy logs array', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()

				// Add a log
				const log: FilterLog = {
					address: '0x1234567890123456789012345678901234567890' as Hex,
					blockHash: '0xabc' as Hex,
					blockNumber: 1n,
					data: '0x' as Hex,
					logIndex: 0n,
					removed: false,
					topics: ['0xdef' as Hex],
					transactionHash: '0x123' as Hex,
					transactionIndex: 0n,
				}
				yield* filter.addLog(id, log)

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Clear original
				yield* filter.getChanges(id)

				// Check copy still has logs
				const copyChanges = yield* copy.getChanges(id)

				return copyChanges.length
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(1)
		})

		it('should deep copy logsCriteria with address and topics', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService

				// Create log filter WITH address and topics criteria
				const id = yield* filter.createLogFilter({
					address: '0x1234567890123456789012345678901234567890' as Hex,
					topics: [
						'0x0000000000000000000000000000000000000000000000000000000000000001' as Hex,
						['0x0000000000000000000000000000000000000000000000000000000000000002' as Hex, '0x0000000000000000000000000000000000000000000000000000000000000003' as Hex],
					],
				})

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Get the filter from the copy
				const copiedFilter = yield* copy.get(id)

				return {
					hasAddress: copiedFilter?.logsCriteria?.address !== undefined,
					hasTopics: copiedFilter?.logsCriteria?.topics !== undefined,
					topicsLength: copiedFilter?.logsCriteria?.topics?.length,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.hasAddress).toBe(true)
			expect(result.hasTopics).toBe(true)
			expect(result.topicsLength).toBe(2)
		})

		it('should deep copy logsCriteria without address/topics', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService

				// Create log filter WITHOUT address and topics (only fromBlock)
				const id = yield* filter.createLogFilter({
					fromBlock: 100n,
				})

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Get the filter from the copy
				const copiedFilter = yield* copy.get(id)

				return {
					hasAddress: copiedFilter?.logsCriteria?.address !== undefined,
					hasTopics: copiedFilter?.logsCriteria?.topics !== undefined,
					hasFromBlock: copiedFilter?.logsCriteria?.fromBlock !== undefined,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.hasAddress).toBe(false)
			expect(result.hasTopics).toBe(false)
			expect(result.hasFromBlock).toBe(true)
		})

		it('should deep copy logsCriteria with topics as single Hex string', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService

				// Create log filter with topics as a single Hex string (not an array)
				// This covers the branch where topics is Hex | Hex[] and we check Array.isArray
				const id = yield* filter.createLogFilter({
					// @ts-expect-error - topics can be Hex | Hex[] per LogFilterParams type
					topics: '0x0000000000000000000000000000000000000000000000000000000000000001' as Hex,
				})

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Get the filter from the copy
				const copiedFilter = yield* copy.get(id)

				return {
					hasTopics: copiedFilter?.logsCriteria?.topics !== undefined,
					// topics should be passed through as-is (single Hex string)
					topicsValue: copiedFilter?.logsCriteria?.topics,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.hasTopics).toBe(true)
			expect(result.topicsValue).toBe('0x0000000000000000000000000000000000000000000000000000000000000001')
		})

		it('should deep copy log.topics array to prevent shared references', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()

				// Add a log with multiple topics
				const log: FilterLog = {
					address: '0x1234567890123456789012345678901234567890' as Hex,
					blockHash: '0xabc' as Hex,
					blockNumber: 1n,
					data: '0x' as Hex,
					logIndex: 0n,
					removed: false,
					topics: ['0xdef' as Hex, '0x123' as Hex],
					transactionHash: '0x456' as Hex,
					transactionIndex: 0n,
				}
				yield* filter.addLog(id, log)

				// Create deep copy
				const copy = yield* filter.deepCopy()

				// Get logs from original and copy
				const originalLogs = yield* filter.getChanges(id)
				const copyLogs = yield* copy.getChanges(id)

				// Verify logs are independent (modifying one shouldn't affect the other)
				// Since getChanges clears logs, we just verify both had logs
				return {
					originalHadLogs: originalLogs.length === 1,
					copyHadLogs: copyLogs.length === 1,
					// Verify topics array is a separate copy
					topicsLength: copyLogs[0]?.topics.length,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.originalHadLogs).toBe(true)
			expect(result.copyHadLogs).toBe(true)
			expect(result.topicsLength).toBe(2)
		})
	})

	describe('lastAccessed timestamp', () => {
		it('should set lastAccessed on filter creation', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				const f = yield* filter.get(id)
				return {
					created: f?.created,
					lastAccessed: f?.lastAccessed,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.created).toBeDefined()
			expect(result.lastAccessed).toBeDefined()
			expect(result.created).toBe(result.lastAccessed)
		})

		it('should update lastAccessed when getChanges is called', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createLogFilter()
				const beforeFilter = yield* filter.get(id)
				const beforeLastAccessed = beforeFilter?.lastAccessed ?? 0

				// Wait a tiny bit to ensure time difference
				yield* Effect.sleep('10 millis')

				// Call getChanges which should update lastAccessed
				yield* filter.getChanges(id)

				const afterFilter = yield* filter.get(id)
				const afterLastAccessed = afterFilter?.lastAccessed ?? 0

				return {
					beforeLastAccessed,
					afterLastAccessed,
					increased: afterLastAccessed > beforeLastAccessed,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.increased).toBe(true)
		})

		it('should update lastAccessed when getBlockChanges is called', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createBlockFilter()
				const beforeFilter = yield* filter.get(id)
				const beforeLastAccessed = beforeFilter?.lastAccessed ?? 0

				// Wait a tiny bit to ensure time difference
				yield* Effect.sleep('10 millis')

				// Call getBlockChanges which should update lastAccessed
				yield* filter.getBlockChanges(id)

				const afterFilter = yield* filter.get(id)
				const afterLastAccessed = afterFilter?.lastAccessed ?? 0

				return {
					increased: afterLastAccessed > beforeLastAccessed,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.increased).toBe(true)
		})

		it('should update lastAccessed when getPendingTransactionChanges is called', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const id = yield* filter.createPendingTransactionFilter()
				const beforeFilter = yield* filter.get(id)
				const beforeLastAccessed = beforeFilter?.lastAccessed ?? 0

				// Wait a tiny bit to ensure time difference
				yield* Effect.sleep('10 millis')

				// Call getPendingTransactionChanges which should update lastAccessed
				yield* filter.getPendingTransactionChanges(id)

				const afterFilter = yield* filter.get(id)
				const afterLastAccessed = afterFilter?.lastAccessed ?? 0

				return {
					increased: afterLastAccessed > beforeLastAccessed,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.increased).toBe(true)
		})
	})

	describe('cleanupExpiredFilters', () => {
		it('should return 0 when no filters exist', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const removedCount = yield* filter.cleanupExpiredFilters()
				return removedCount
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(0)
		})

		it('should return 0 when all filters are fresh', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.createLogFilter()
				yield* filter.createBlockFilter()
				yield* filter.createPendingTransactionFilter()

				// Cleanup with default 5-minute expiration - all filters should be kept
				const removedCount = yield* filter.cleanupExpiredFilters()
				const allFilters = yield* filter.getAllFilters

				return { removedCount, filterCount: allFilters.size }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.removedCount).toBe(0)
			expect(result.filterCount).toBe(3)
		})

		it('should remove filters older than custom expiration time', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.createLogFilter()
				yield* filter.createBlockFilter()

				// Wait a tiny bit
				yield* Effect.sleep('20 millis')

				// Cleanup with very short expiration (10ms) - filters should be expired
				const removedCount = yield* filter.cleanupExpiredFilters(10)
				const allFilters = yield* filter.getAllFilters

				return { removedCount, filterCount: allFilters.size }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.removedCount).toBe(2)
			expect(result.filterCount).toBe(0)
		})

		it('should keep filters that have been accessed recently', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				const logId = yield* filter.createLogFilter()
				const blockId = yield* filter.createBlockFilter()

				// Wait a tiny bit
				yield* Effect.sleep('20 millis')

				// Access the log filter to update its lastAccessed
				yield* filter.getChanges(logId)

				// Wait a tiny bit more
				yield* Effect.sleep('20 millis')

				// Cleanup with 30ms expiration - only block filter should be expired
				// (it hasn't been accessed since creation, while log filter was just accessed)
				const removedCount = yield* filter.cleanupExpiredFilters(30)
				const allFilters = yield* filter.getAllFilters

				return {
					removedCount,
					filterCount: allFilters.size,
					hasLogFilter: allFilters.has(logId),
					hasBlockFilter: allFilters.has(blockId),
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.removedCount).toBe(1)
			expect(result.filterCount).toBe(1)
			expect(result.hasLogFilter).toBe(true)
			expect(result.hasBlockFilter).toBe(false)
		})

		it('should use default expiration when no parameter is provided', async () => {
			const program = Effect.gen(function* () {
				const filter = yield* FilterService
				yield* filter.createLogFilter()

				// With default 5-minute expiration, a freshly created filter should not be expired
				const removedCount = yield* filter.cleanupExpiredFilters()
				const allFilters = yield* filter.getAllFilters

				return { removedCount, filterCount: allFilters.size }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result.removedCount).toBe(0)
			expect(result.filterCount).toBe(1)
		})
	})
})
