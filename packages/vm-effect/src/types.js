/**
 * @module @tevm/vm-effect/types
 * @description Type definitions for the vm-effect package
 */

/**
 * VM execution error type - reuses EvmError from evm-effect
 * @typedef {import('@tevm/evm-effect').EvmError} VmError
 */

/**
 * VmShape interface for Effect-based VM operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Virtual Machine, including transaction and block execution.
 *
 * Note: runTx and runBlock have typed error channels (VmError) for exceptions
 * thrown during VM execution. This uses the same error mapping as EvmService.
 *
 * @typedef {Object} VmShape
 * @property {import('@tevm/vm').Vm} vm - The underlying VM instance
 * @property {(opts: import('@tevm/vm').RunTxOpts) => import('effect').Effect.Effect<import('@tevm/vm').RunTxResult, VmError>} runTx - Execute a transaction. Typed error channel for exceptions.
 * @property {(opts: import('@tevm/vm').RunBlockOpts) => import('effect').Effect.Effect<import('@tevm/vm').RunBlockResult, VmError>} runBlock - Execute a block. Typed error channel for exceptions.
 * @property {(opts: import('@tevm/vm').BuildBlockOpts) => import('effect').Effect.Effect<Awaited<ReturnType<import('@tevm/vm').Vm['buildBlock']>>, VmError>} buildBlock - Build a new block. Typed error channel for exceptions.
 * @property {import('effect').Effect.Effect<void>} ready - Effect that completes when VM is ready
 * @property {() => import('effect').Effect.Effect<VmShape>} deepCopy - Create a deep copy of the VM
 */

/**
 * Configuration options for VmLive layer
 * @typedef {Object} VmLiveOptions
 * @property {boolean} [profiler] - Enable VM profiler
 * @property {boolean} [loggingEnabled] - Enable logging for VM operations
 */

export {}
