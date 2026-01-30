/**
 * @module @tevm/vm-effect/VmShape
 * @description Documentation for the VmShape interface
 */

/**
 * @typedef {import('./types.js').VmShape} VmShape
 */

/**
 * VmShape Interface
 * ==================
 *
 * The `VmShape` interface defines the Effect-based API for Virtual Machine operations.
 * All methods are wrapped in Effect for composable error handling and dependency injection.
 *
 * ## Properties
 *
 * ### vm
 * The underlying `@tevm/vm` Vm instance. Direct access is provided for
 * advanced use cases that need the raw Promise-based API.
 *
 * ### runTx(opts)
 * Execute a transaction in the VM.
 *
 * @param opts - Transaction execution options including tx, skipNonce, skipBalance
 *
 * Returns: `Effect<RunTxResult>`
 *
 * ### runBlock(opts)
 * Execute a block in the VM.
 *
 * @param opts - Block execution options including block, generate, skipNonce
 *
 * Returns: `Effect<RunBlockResult>`
 *
 * ### buildBlock(opts)
 * Build a new block. Returns a block builder that can be used to
 * add transactions and finalize the block.
 *
 * @param opts - Build block options including parentBlock, headerData
 *
 * Returns: `Effect<BlockBuilder>`
 *
 * ### ready
 * Effect that completes when the VM is fully initialized.
 *
 * Returns: `Effect<void>`
 *
 * ### deepCopy()
 * Create a deep copy of the VM with independent state.
 *
 * Returns: `Effect<VmShape>`
 *
 * ## Usage Example
 *
 * ```javascript
 * import { Effect } from 'effect'
 * import { VmService } from '@tevm/vm-effect'
 *
 * const program = Effect.gen(function* () {
 *   const vmService = yield* VmService
 *   yield* vmService.ready
 *
 *   // Build a block
 *   const blockBuilder = yield* vmService.buildBlock({
 *     headerData: { gasLimit: 8000000n }
 *   })
 *
 *   // Add transactions
 *   await blockBuilder.addTransaction(tx1)
 *   await blockBuilder.addTransaction(tx2)
 *
 *   // Finalize and get the block
 *   const block = await blockBuilder.build()
 *   console.log('Built block:', block.header.number)
 * })
 * ```
 */

export {}
