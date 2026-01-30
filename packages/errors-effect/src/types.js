/**
 * Union type for all EVM execution errors
 *
 * @typedef {import('./evm/InsufficientBalanceError.js').InsufficientBalanceError | import('./evm/InsufficientFundsError.js').InsufficientFundsError | import('./evm/InvalidJumpError.js').InvalidJumpError | import('./evm/OutOfGasError.js').OutOfGasError | import('./evm/RevertError.js').RevertError | import('./evm/InvalidOpcodeError.js').InvalidOpcodeError | import('./evm/StackOverflowError.js').StackOverflowError | import('./evm/StackUnderflowError.js').StackUnderflowError} EvmExecutionError
 */

/**
 * Union type for all JSON-RPC errors
 *
 * @typedef {import('./jsonrpc/InvalidRequestError.js').InvalidRequestError | import('./jsonrpc/MethodNotFoundError.js').MethodNotFoundError | import('./jsonrpc/InvalidParamsError.js').InvalidParamsError | import('./jsonrpc/InternalError.js').InternalError} JsonRpcError
 */

/**
 * Union type for all node errors
 *
 * @typedef {import('./node/SnapshotNotFoundError.js').SnapshotNotFoundError | import('./node/FilterNotFoundError.js').FilterNotFoundError | import('./node/NodeNotReadyError.js').NodeNotReadyError} NodeError
 */

/**
 * Union type for all transport errors
 *
 * @typedef {import('./transport/ForkError.js').ForkError | import('./transport/NetworkError.js').NetworkError | import('./transport/TimeoutError.js').TimeoutError} TransportError
 */

/**
 * Union type for all state errors
 *
 * @typedef {import('./state/StateRootNotFoundError.js').StateRootNotFoundError | import('./state/AccountNotFoundError.js').AccountNotFoundError | import('./state/StorageError.js').StorageError} StateError
 */

/**
 * Union type for all transaction errors
 *
 * @typedef {import('./transaction/InvalidTransactionError.js').InvalidTransactionError | import('./transaction/NonceTooLowError.js').NonceTooLowError | import('./transaction/NonceTooHighError.js').NonceTooHighError | import('./transaction/GasTooLowError.js').GasTooLowError} TransactionError
 */

/**
 * Union type for all block errors
 *
 * @typedef {import('./block/BlockNotFoundError.js').BlockNotFoundError | import('./block/InvalidBlockError.js').InvalidBlockError | import('./block/BlockGasLimitExceededError.js').BlockGasLimitExceededError} BlockError
 */

/**
 * Union type for all TEVM errors
 *
 * @typedef {import('./TevmError.js').TevmError | EvmExecutionError | JsonRpcError | NodeError | TransportError | StateError | TransactionError | BlockError} TevmErrorUnion
 */

// Export types by defining type-only exports
export {}
