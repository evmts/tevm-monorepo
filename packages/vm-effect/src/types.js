/**
 * @module @tevm/vm-effect/types
 * @description Type definitions for the vm-effect package
 */

/**
 * VmShape interface for Effect-based VM operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Virtual Machine, including transaction and block execution.
 *
 * @typedef {Object} VmShape
 * @property {import('@tevm/vm').Vm} vm - The underlying VM instance
 * @property {(opts: import('@tevm/vm').RunTxOpts) => import('effect').Effect.Effect<import('@tevm/vm').RunTxResult>} runTx - Execute a transaction
 * @property {(opts: import('@tevm/vm').RunBlockOpts) => import('effect').Effect.Effect<import('@tevm/vm').RunBlockResult>} runBlock - Execute a block
 * @property {(opts: import('@tevm/vm').BuildBlockOpts) => import('effect').Effect.Effect<ReturnType<import('@tevm/vm').Vm['buildBlock']>>} buildBlock - Build a new block
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
