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
							const filters = yield* Ref.get(fltrRef)
							const filter = filters.get(id)

							if (!filter) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							// Get current logs and clear them (atomic operation)
							const logs = [...filter.logs]
							yield* Ref.update(fltrRef, (map) => {
								const newMap = new Map(map)
								// Safe to use non-null assertion since we validated filter exists above
								const f = /** @type {Filter} */ (map.get(id))
								newMap.set(id, { ...f, logs: [] })
								return newMap
							})

							return logs
						}),

					getBlockChanges: (id) =>
						Effect.gen(function* () {
							const filters = yield* Ref.get(fltrRef)
							const filter = filters.get(id)

							if (!filter) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							if (filter.type !== 'Block') {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter ${id} is not a block filter`,
									}),
								)
							}

							// Get current blocks and clear them
							const blocks = [...filter.blocks]
							yield* Ref.update(fltrRef, (map) => {
								const newMap = new Map(map)
								// Safe to use non-null assertion since we validated filter exists above
								const f = /** @type {Filter} */ (map.get(id))
								newMap.set(id, { ...f, blocks: [] })
								return newMap
							})

							return blocks
						}),

					getPendingTransactionChanges: (id) =>
						Effect.gen(function* () {
							const filters = yield* Ref.get(fltrRef)
							const filter = filters.get(id)

							if (!filter) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							if (filter.type !== 'PendingTransaction') {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter ${id} is not a pending transaction filter`,
									}),
								)
							}

							// Get current txs and clear them
							const txs = [...filter.tx]
							yield* Ref.update(fltrRef, (map) => {
								const newMap = new Map(map)
								// Safe to use non-null assertion since we validated filter exists above
								const f = /** @type {Filter} */ (map.get(id))
								newMap.set(id, { ...f, tx: [] })
								return newMap
							})

							return txs
						}),

					addLog: (id, log) =>
						Effect.gen(function* () {
							const filters = yield* Ref.get(fltrRef)
							const filter = filters.get(id)

							if (!filter) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							yield* Ref.update(fltrRef, (map) => {
								const newMap = new Map(map)
								// Safe to use non-null assertion since we validated filter exists above
								const f = /** @type {Filter} */ (map.get(id))
								newMap.set(id, { ...f, logs: [...f.logs, log] })
								return newMap
							})
						}),

					addBlock: (id, block) =>
						Effect.gen(function* () {
							const filters = yield* Ref.get(fltrRef)
							const filter = filters.get(id)

							if (!filter) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							yield* Ref.update(fltrRef, (map) => {
								const newMap = new Map(map)
								// Safe to use non-null assertion since we validated filter exists above
								const f = /** @type {Filter} */ (map.get(id))
								newMap.set(id, { ...f, blocks: [...f.blocks, block] })
								return newMap
							})
						}),

					addPendingTransaction: (id, tx) =>
						Effect.gen(function* () {
							const filters = yield* Ref.get(fltrRef)
							const filter = filters.get(id)

							if (!filter) {
								return yield* Effect.fail(
									new FilterNotFoundError({
										filterId: id,
										message: `Filter with id ${id} not found`,
									}),
								)
							}

							yield* Ref.update(fltrRef, (map) => {
								const newMap = new Map(map)
								// Safe to use non-null assertion since we validated filter exists above
								const f = /** @type {Filter} */ (map.get(id))
								newMap.set(id, { ...f, tx: [...f.tx, tx] })
								return newMap
							})
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
								newFiltersMap.set(key, {
									...filter,
									logs: [...filter.logs],
									tx: [...filter.tx],
									blocks: [...filter.blocks],
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
