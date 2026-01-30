import { Effect, Layer, Ref } from 'effect'
import { FilterNotFoundError, InvalidFilterTypeError } from '@tevm/errors-effect'
import { FilterService } from './FilterService.js'
import { DEFAULT_FILTER_EXPIRATION_MS } from './types.js'

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

						// Create filter - use spread to conditionally include optional properties
						// to satisfy exactOptionalPropertyTypes
						const now = Date.now()
						/** @type {Filter} */
						const filter = {
							id: hexId,
							type,
							created: now,
							lastAccessed: now,
							...(logsCriteria !== undefined ? { logsCriteria } : {}),
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

				const shape = {
					createLogFilter: (/** @type {LogFilterParams | undefined} */ params) => createFilter('Log', params),

					createBlockFilter: () => createFilter('Block'),

					createPendingTransactionFilter: () => createFilter('PendingTransaction'),

					get: (/** @type {Hex} */ id) => Ref.get(fltrRef).pipe(Effect.map((m) => m.get(id))),

					remove: (/** @type {Hex} */ id) =>
						Effect.gen(function* () {
							// Atomic check-and-update with listener cleanup (Issue #285/#286)
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, listeners: /** @type {Array<() => void>} */ ([]) }, map])
								}
								const newMap = new Map(map)
								newMap.delete(id)
								return /** @type {const} */ ([{ found: true, listeners: filter.registeredListeners }, newMap])
							})

							// Clean up registered listeners to prevent memory leaks
							if (result.found && result.listeners.length > 0) {
								for (const listener of result.listeners) {
									if (typeof listener === 'function') {
										try {
											listener()
										} catch {
											// Ignore cleanup errors - best effort cleanup
										}
									}
								}
							}

							return result.found
						}),

					getChanges: (/** @type {Hex} */ id) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							/**
							 * @type {{ found: boolean; wrongType: boolean; logs?: FilterLog[] }}
							 */
							// @ts-expect-error - Ref.modify union return type inference issue with literal booleans
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, wrongType: false }, map])
								}
								if (filter.type !== 'Log') {
									return /** @type {const} */ ([{ found: true, wrongType: true }, map])
								}
								// Atomically get logs, clear them, and update lastAccessed
								const logs = [...filter.logs]
								const newMap = new Map(map)
								newMap.set(id, { ...filter, logs: [], lastAccessed: Date.now() })
								return /** @type {const} */ ([{ found: true, wrongType: false, logs }, newMap])
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
									new InvalidFilterTypeError({
										filterId: id,
										expectedType: 'Log',
										message: `Filter ${id} is not a log filter`,
									}),
								)
							}

							// At this point, logs is guaranteed to be defined
							return /** @type {FilterLog[]} */ (result.logs)
						}),

					getBlockChanges: (/** @type {Hex} */ id) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							/**
							 * @type {{ found: boolean; wrongType: boolean; blocks?: unknown[] }}
							 */
							// @ts-expect-error - Ref.modify union return type inference issue with literal booleans
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, wrongType: false }, map])
								}
								if (filter.type !== 'Block') {
									return /** @type {const} */ ([{ found: true, wrongType: true }, map])
								}
								// Atomically get blocks, clear them, and update lastAccessed
								const blocks = [...filter.blocks]
								const newMap = new Map(map)
								newMap.set(id, { ...filter, blocks: [], lastAccessed: Date.now() })
								return /** @type {const} */ ([{ found: true, wrongType: false, blocks }, newMap])
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
									new InvalidFilterTypeError({
										filterId: id,
										expectedType: 'Block',
										message: `Filter ${id} is not a block filter`,
									}),
								)
							}

							// At this point, blocks is guaranteed to be defined
							return /** @type {unknown[]} */ (result.blocks)
						}),

					getPendingTransactionChanges: (/** @type {Hex} */ id) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							/**
							 * @type {{ found: boolean; wrongType: boolean; txs?: unknown[] }}
							 */
							// @ts-expect-error - Ref.modify union return type inference issue with literal booleans
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, wrongType: false }, map])
								}
								if (filter.type !== 'PendingTransaction') {
									return /** @type {const} */ ([{ found: true, wrongType: true }, map])
								}
								// Atomically get txs, clear them, and update lastAccessed
								const txs = [...filter.tx]
								const newMap = new Map(map)
								newMap.set(id, { ...filter, tx: [], lastAccessed: Date.now() })
								return /** @type {const} */ ([{ found: true, wrongType: false, txs }, newMap])
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
									new InvalidFilterTypeError({
										filterId: id,
										expectedType: 'PendingTransaction',
										message: `Filter ${id} is not a pending transaction filter`,
									}),
								)
							}

							// At this point, txs is guaranteed to be defined
							return /** @type {unknown[]} */ (result.txs)
						}),

					addLog: (/** @type {Hex} */ id, /** @type {FilterLog} */ log) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							/**
							 * @type {{ found: boolean; wrongType: boolean }}
							 */
							// @ts-expect-error - Ref.modify union return type inference issue with literal booleans
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, wrongType: false }, map])
								}
								if (filter.type !== 'Log') {
									return /** @type {const} */ ([{ found: true, wrongType: true }, map])
								}
								const newMap = new Map(map)
								newMap.set(id, { ...filter, logs: [...filter.logs, log] })
								return /** @type {const} */ ([{ found: true, wrongType: false }, newMap])
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
									new InvalidFilterTypeError({
										filterId: id,
										expectedType: 'Log',
										message: `Filter ${id} is not a log filter`,
									}),
								)
							}
						}),

					addBlock: (/** @type {Hex} */ id, /** @type {unknown} */ block) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							/**
							 * @type {{ found: boolean; wrongType: boolean }}
							 */
							// @ts-expect-error - Ref.modify union return type inference issue with literal booleans
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, wrongType: false }, map])
								}
								if (filter.type !== 'Block') {
									return /** @type {const} */ ([{ found: true, wrongType: true }, map])
								}
								const newMap = new Map(map)
								newMap.set(id, { ...filter, blocks: [...filter.blocks, block] })
								return /** @type {const} */ ([{ found: true, wrongType: false }, newMap])
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
									new InvalidFilterTypeError({
										filterId: id,
										expectedType: 'Block',
										message: `Filter ${id} is not a block filter`,
									}),
								)
							}
						}),

					addPendingTransaction: (/** @type {Hex} */ id, /** @type {unknown} */ tx) =>
						Effect.gen(function* () {
							// Atomic check-and-update using Ref.modify to prevent TOCTOU race
							/**
							 * @type {{ found: boolean; wrongType: boolean }}
							 */
							// @ts-expect-error - Ref.modify union return type inference issue with literal booleans
							const result = yield* Ref.modify(fltrRef, (map) => {
								const filter = map.get(id)
								if (!filter) {
									return /** @type {const} */ ([{ found: false, wrongType: false }, map])
								}
								if (filter.type !== 'PendingTransaction') {
									return /** @type {const} */ ([{ found: true, wrongType: true }, map])
								}
								const newMap = new Map(map)
								newMap.set(id, { ...filter, tx: [...filter.tx, tx] })
								return /** @type {const} */ ([{ found: true, wrongType: false }, newMap])
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
									new InvalidFilterTypeError({
										filterId: id,
										expectedType: 'PendingTransaction',
										message: `Filter ${id} is not a pending transaction filter`,
									}),
								)
							}
						}),

					getAllFilters: Ref.get(fltrRef),

					cleanupExpiredFilters: (/** @type {number | undefined} */ expirationMs) =>
						Effect.gen(function* () {
							const now = Date.now()
							const expiration = expirationMs ?? DEFAULT_FILTER_EXPIRATION_MS

							// Atomic get-and-update with listener collection for cleanup (Issue #285/#286)
							const { removedCount, listenersToCleanup } = yield* Ref.modify(fltrRef, (map) => {
								let removedCount = 0
								/** @type {Array<() => void>} */
								const listenersToCleanup = []
								const newMap = new Map()

								for (const [key, filter] of map) {
									const age = now - filter.lastAccessed
									if (age < expiration) {
										// Filter is still valid, keep it
										newMap.set(key, filter)
									} else {
										// Filter has expired, collect listeners for cleanup
										removedCount++
										if (filter.registeredListeners.length > 0) {
											listenersToCleanup.push(...filter.registeredListeners)
										}
									}
								}

								return /** @type {const} */ ([{ removedCount, listenersToCleanup }, newMap])
							})

							// Clean up registered listeners to prevent memory leaks
							for (const listener of listenersToCleanup) {
								if (typeof listener === 'function') {
									try {
										listener()
									} catch {
										// Ignore cleanup errors - best effort cleanup
									}
								}
							}

							return removedCount
						}),

					/**
					 * Creates a deep copy of the filter service with fully isolated state.
					 *
					 * Note on registeredListeners (Issue #257):
					 * - Listener functions cannot be truly deep copied (closures capture references)
					 * - For true isolation, deep copy clears registeredListeners on all filters
					 * - This ensures events on the original filter don't fire on the copied filter
					 * - If you need to preserve listeners, re-register them after deep copy
					 */
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
									// tx and blocks are unknown[] - cast to object for spreading
									tx: filter.tx.map((t) => ({ .../** @type {object} */ (t) })),
									blocks: filter.blocks.map((b) => ({ .../** @type {object} */ (b) })),
									// Issue #257 fix: Clear listeners for true isolation - functions can't be cloned
									// and shared listeners would cause cross-copy event handling issues
									registeredListeners: [],
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
