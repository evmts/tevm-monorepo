/**
 * Union type for all EVM execution errors
 *
 * @typedef {import('./evm/InsufficientBalanceError.js').InsufficientBalanceError | import('./evm/OutOfGasError.js').OutOfGasError | import('./evm/RevertError.js').RevertError | import('./evm/InvalidOpcodeError.js').InvalidOpcodeError | import('./evm/StackOverflowError.js').StackOverflowError | import('./evm/StackUnderflowError.js').StackUnderflowError} EvmExecutionError
 */

/**
 * Union type for all TEVM errors
 *
 * @typedef {import('./TevmError.js').TevmError | EvmExecutionError} TevmErrorUnion
 */

// Export types by defining type-only exports
export {}
