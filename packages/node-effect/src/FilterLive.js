import { Effect, Layer, Ref } from 'effect'
import { FilterNotFoundError } from '@tevm/errors-effect'
import { FilterService } from './FilterService.js'

/**
 * @module @tevm/node-effect/FilterLive
 * @description Layer that creates FilterService using Effect Refs
 */

/**
 * @typedef {import('./types.js').FilterShape} FilterShape
 * @typedef {import('./types.js').Filter} Filter
 * @typedef {import('./types.js').FilterType} FilterType
 * @typedef {import('./types.js').FilterLog} FilterLog
 * @typedef {import('./types.js').LogFilterParams} LogFilterParams
 * @typedef {import('./types.js').Hex} Hex
 */

/**
 * Converts a number to a hex string.
 * @param {number} num - The number to convert
 * @returns {Hex} The hex string
 */
const toHex = (num) => /** @type {Hex} */ (`0x${num.toString(16)}`)

/**
 * Creates a FilterService layer using Effect Refs for state management.
 *
 * This layer creates a service that manages blockchain event filters with Refs:
 * - filters: Map of filter ID to filter data
 * - counter: Counter for generating unique filter IDs
 *
 * The service supports three types of filters:
 * - Log filters: Track contract events matching specified criteria
 * - Block filters: Track new blocks
 * - PendingTransaction filters: Track pending transactions
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { FilterService, FilterLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const filter = yield* FilterService
 *
 *   // Create a block filter
 *   const blockFilterId = yield* filter.createBlockFilter()
 *   console.log('Block filter created:', blockFilterId)
 *
 *   // Create a pending transaction filter
 *   const txFilterId = yield* filter.createPendingTransactionFilter()
 *   console.log('Tx filter created:', txFilterId)
 *
 *   // Get all filters
 *   const allFilters = yield* filter.getAllFilters
 *   console.log('Total filters:', allFilters.size)
 * })
 *
 * const layer = FilterLive()
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @returns {Layer.Layer<FilterService>} Layer providing FilterService
 */
export const FilterLive = () => {
	return Layer.effect(
		FilterService,
		Effect.gen(function* () {
			// Create Refs for mutable state
			/** @type {Ref.Ref<Map<Hex, Filter>>} */
			const filtersRef = yield* Ref.make(new Map())
			/** @type {Ref.Ref<number>} */
			const counterRef = yield* Ref.make(1)

			/**
			 * Creates a FilterShape from Refs.
			 * This helper enables the deepCopy pattern.
			 *
			 * @param {Ref.Ref<Map<Hex, Filter>>} fltrRef
			 * @param {Ref.Ref<number>} ctrRef
			 * @returns {FilterShape}
			 */
			const createShape = (fltrRef, ctrRef) => {
				/**
				 * Creates a new filter with the given type
				 * @param {FilterType} type
				 * @param {import('./types.js').LogFilterParams} [logsCriteria]
				 * @returns {import('effect').Effect.Effect<Hex>}
				 */
				const createFilter = (type, logsCriteria) =>
					Effect.gen(function* () {
						// Generate unique ID
						const id = yield* Ref.getAndUpdate(ctrRef, (n) => n + 1)
						const hexId = toHex(id)

						// Create filter
						/** @type {Filter} */
						const filter = {
							id: hexId,
							type,
							created: Date.now(),
							logsCriteria,
							logs: [],
							tx: [],
							blocks: [],
							installed: {},
							err: undefined,
							registeredListeners: [],
						}

						// Store filter
						yield* Ref.update(fltrRef, (map) => {
							const newMap = new Map(map)
							newMap.set(hexId, filter)
							return newMap
						})

						return hexId
					})

				/** @type {FilterShape} */
				const shape = {
					createLogFilter: (params) => createFilter('Log', params),

					createBlockFilter: () => createFilter('Block'),

					createPendingTransactionFilter: () => createFilter('PendingTransaction'),

					get: (id) => Ref.get(fltrRef).pipe(Effect.map((m) => m.get(id))),

					remove: (id) =>
						Ref.getAndUpdate(fltrRef, (map) => {
							if (!map.has(id)) {
								return map
							}
							const newMap = new Map(map)
							newMap.delete(id)
							return newMap
						}).pipe(Effect.map((oldMap) => oldMap.has(id))),

					getChanges: (id) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return [{ found: /** @type {const} */ (false) }, map]
								}
								// Atomically get logs and clear them
								const logs = [...filter.logs]
								const newMap = new Map(map)
								newMap.set(id, { ...filter, logs: [] })
								return [{ found: /** @type {const} */ (true), logs }, newMap]
							})

							if (!result.found) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							return result.logs
						}),

					getBlockChanges: (id) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return [{ found: /** @type {const} */ (false), wrongType: false }, map]
								}
								if (filter.type !== 'Block') {
									return [{ found: /** @type {const} */ (true), wrongType: /** @type {const} */ (true) }, map]
								}
								// Atomically get blocks and clear them
								const blocks = [...filter.blocks]
								const newMap = new Map(map)
								newMap.set(id, { ...filter, blocks: [] })
								return [{ found: /** @type {const} */ (true), wrongType: /** @type {const} */ (false), blocks }, newMap]
							})

							if (!result.found) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							if (result.wrongType) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter ${id} is not a block filter`,
									}),
								)
							}

							return result.blocks
						}),

					getPendingTransactionChanges: (id) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return [{ found: /** @type {const} */ (false), wrongType: false }, map]
								}
								if (filter.type !== 'PendingTransaction') {
									return [{ found: /** @type {const} */ (true), wrongType: /** @type {const} */ (true) }, map]
								}
								// Atomically get txs and clear them
								const txs = [...filter.tx]
								const newMap = new Map(map)
								newMap.set(id, { ...filter, tx: [] })
								return [{ found: /** @type {const} */ (true), wrongType: /** @type {const} */ (false), txs }, newMap]
							})

							if (!result.found) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							if (result.wrongType) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter ${id} is not a pending transaction filter`,
									}),
								)
							}

							return result.txs
						}),

					addLog: (id, log) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							const found = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return [false, map]
								}
								const newMap = new Map(map)
								newMap.set(id, { ...filter, logs: [...filter.logs, log] })
								return [true, newMap]
							})

							if (!found) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}
						}),

					addBlock: (id, block) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							const found = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return [false, map]
								}
								const newMap = new Map(map)
								newMap.set(id, { ...filter, blocks: [...filter.blocks, block] })
								return [true, newMap]
							})

							if (!found) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}
						}),

					addPendingTransaction: (id, tx) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							const found = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return [false, map]
								}
								const newMap = new Map(map)
								newMap.set(id, { ...filter, tx: [...filter.tx, tx] })
								return [true, newMap]
							})

							if (!found) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}
						}),

					getAllFilters: Ref.get(fltrRef),

					deepCopy: () =>
						Effect.gen(function* () {
							// Read current values
							const filters = yield* Ref.get(fltrRef)
							const counter = yield* Ref.get(ctrRef)

							// Deep copy filters map with new filter objects
							const newFiltersMap = new Map()
							for (const [key, filter] of filters) {
								// Deep copy each filter's nested objects
								newFiltersMap.set(key, {
									...filter,
									// Deep copy logsCriteria if it exists
									logsCriteria: filter.logsCriteria
										? {
												...filter.logsCriteria,
												// address is Hex (string type), NOT an array - no spreading needed
												address: filter.logsCriteria.address,
												// topics can be Hex | Hex[] - must check if array before mapping
												topics: filter.logsCriteria.topics
													? Array.isArray(filter.logsCriteria.topics)
														? filter.logsCriteria.topics.map((t) =>
																Array.isArray(t) ? [...t] : t,
															)
														: filter.logsCriteria.topics
													: filter.logsCriteria.topics,
											}
										: undefined,
									// Deep copy installed object (always defined, see createFilter)
									installed: { ...filter.installed },
									// Deep copy arrays with individual object copies - must deep copy topics array
									logs: filter.logs.map((log) => ({ ...log, topics: [...log.topics] })),
									tx: filter.tx.map((t) => ({ ...t })),
									blocks: filter.blocks.map((b) => ({ ...b })),
									registeredListeners: [...filter.registeredListeners],
								})
							}

							// Create new Refs with copied values
							const newFiltersRef = yield* Ref.make(newFiltersMap)
							const newCounterRef = yield* Ref.make(counter)

							// Return new shape
							return createShape(newFiltersRef, newCounterRef)
						}),
				}
				return shape
			}

			return createShape(filtersRef, counterRef)
		}),
	)
}
