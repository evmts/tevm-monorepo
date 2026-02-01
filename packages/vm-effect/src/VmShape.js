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
 * Returns: `Effect<RunTxResult, VmError>` - Typed error channel for VM execution errors
 *
 * ### runBlock(opts)
 * Execute a block in the VM.
 *
 * @param opts - Block execution options including block, generate, skipNonce
 *
 * Returns: `Effect<RunBlockResult, VmError>` - Typed error channel for VM execution errors
 *
 * ### buildBlock(opts)
 * Build a new block. Returns a block builder that can be used to
 * add transactions and finalize the block.
 *
 * @param opts - Build block options including parentBlock, headerData
 *
 * Returns: `Effect<BlockBuilder, VmError>` - Typed error channel for build errors
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
 *   // Execute a transaction with typed error handling
 *   const txResult = yield* vmService.runTx({ tx: signedTx }).pipe(
 *     Effect.catchTag('OutOfGasError', (e) => Effect.succeed({ gasUsed: 0n })),
 *     Effect.catchTag('RevertError', (e) => {
 *       console.log('Reverted with data:', e.raw)
 *       return Effect.fail(e)
 *     })
 *   )
 *
 *   // Build a block (note: addTransaction returns a Promise, not Effect)
 *   const blockBuilder = yield* vmService.buildBlock({
 *     headerData: { gasLimit: 8000000n }
 *   })
 *
 *   // BlockBuilder methods are Promise-based
 *   yield* Effect.promise(async () => {
 *     await blockBuilder.addTransaction(tx1)
 *     await blockBuilder.addTransaction(tx2)
 *     const block = await blockBuilder.build()
 *     console.log('Built block:', block.header.number)
 *     return block
 *   })
 * })
 * ```
 */

export {}
