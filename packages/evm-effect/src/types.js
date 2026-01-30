/**
 * @module @tevm/evm-effect/types
 * @description Type definitions for the evm-effect package
 */

/**
 * EvmShape interface for Effect-based EVM operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Ethereum Virtual Machine, including call execution and precompile management.
 *
 * @typedef {Object} EvmShape
 * @property {import('@tevm/evm').Evm} evm - The underlying EVM instance
 * @property {(opts: import('@ethereumjs/evm').EVMRunCallOpts) => import('effect').Effect.Effect<import('@ethereumjs/evm').EVMResult>} runCall - Execute a call in the EVM. Execution errors are in execResult.exceptionError
 * @property {(opts: import('@ethereumjs/evm').EVMRunCodeOpts) => import('effect').Effect.Effect<import('@ethereumjs/evm').ExecResult>} runCode - Execute code in the EVM. Execution errors are in exceptionError property
 * @property {() => import('effect').Effect.Effect<Map<string, import('@ethereumjs/evm').PrecompileInput>>} getActivePrecompiles - Get all active precompiles
 * @property {(precompile: import('@tevm/evm').CustomPrecompile) => import('effect').Effect.Effect<void>} addCustomPrecompile - Add a custom precompile
 * @property {(precompile: import('@tevm/evm').CustomPrecompile) => import('effect').Effect.Effect<void>} removeCustomPrecompile - Remove a custom precompile
 */

/**
 * Configuration options for EvmLive layer
 * @typedef {Object} EvmLiveOptions
 * @property {boolean} [allowUnlimitedContractSize] - Allow contracts larger than EIP-170 limit
 * @property {import('@tevm/evm').CustomPrecompile[]} [customPrecompiles] - Custom precompiles to add
 * @property {boolean} [profiler] - Enable EVM profiler
 * @property {boolean} [loggingEnabled] - Enable logging for EVM operations
 */

export {}
