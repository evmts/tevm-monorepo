/**
 * @module @tevm/evm-effect/types
 * @description Type definitions for the evm-effect package
 */

/**
 * EVM execution error type - union of specific EVM errors and general TevmError
 * @typedef {import('@tevm/errors-effect').OutOfGasError | import('@tevm/errors-effect').RevertError | import('@tevm/errors-effect').InvalidOpcodeError | import('@tevm/errors-effect').StackOverflowError | import('@tevm/errors-effect').StackUnderflowError | import('@tevm/errors-effect').InsufficientBalanceError | import('@tevm/errors-effect').InsufficientFundsError | import('@tevm/errors-effect').InvalidJumpError | import('@tevm/errors-effect').TevmError} EvmError
 */

/**
 * EvmShape interface for Effect-based EVM operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * Ethereum Virtual Machine, including call execution and precompile management.
 *
 * Note: runCall and runCode return the EVM result in the success channel.
 * The error channel (EvmError) is for exceptions thrown during EVM setup/execution.
 * Execution-level "errors" like reverts and out-of-gas are returned in the
 * execResult.exceptionError property of the success value, as is standard for EVM.
 *
 * @typedef {Object} EvmShape
 * @property {import('@tevm/evm').Evm} evm - The underlying EVM instance
 * @property {(opts: import('@tevm/evm').EvmRunCallOpts) => import('effect').Effect.Effect<import('@tevm/evm').EvmResult, EvmError>} runCall - Execute a call in the EVM. Typed error channel for exceptions; execution errors in execResult.exceptionError
 * @property {(opts: import('@tevm/evm').EvmRunCallOpts) => import('effect').Effect.Effect<import('@tevm/evm').ExecResult, EvmError>} runCode - Execute code in the EVM. Typed error channel for exceptions; execution errors in exceptionError property
 * @property {() => import('effect').Effect.Effect<import('@tevm/evm').Evm['precompiles']>} getActivePrecompiles - Get all active precompiles
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
