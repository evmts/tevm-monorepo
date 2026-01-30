import { TevmError } from '../TevmError.js'
// EVM errors
import { InsufficientBalanceError } from '../evm/InsufficientBalanceError.js'
import { InsufficientFundsError } from '../evm/InsufficientFundsError.js'
import { InvalidJumpError } from '../evm/InvalidJumpError.js'
import { InvalidOpcodeError } from '../evm/InvalidOpcodeError.js'
import { OutOfGasError } from '../evm/OutOfGasError.js'
import { RevertError } from '../evm/RevertError.js'
import { StackOverflowError } from '../evm/StackOverflowError.js'
import { StackUnderflowError } from '../evm/StackUnderflowError.js'
// Transport errors
import { ForkError } from '../transport/ForkError.js'
import { NetworkError } from '../transport/NetworkError.js'
import { TimeoutError } from '../transport/TimeoutError.js'
// Block errors
import { BlockNotFoundError } from '../block/BlockNotFoundError.js'
import { InvalidBlockError } from '../block/InvalidBlockError.js'
import { BlockGasLimitExceededError } from '../block/BlockGasLimitExceededError.js'
// Transaction errors
import { InvalidTransactionError } from '../transaction/InvalidTransactionError.js'
import { NonceTooLowError } from '../transaction/NonceTooLowError.js'
import { NonceTooHighError } from '../transaction/NonceTooHighError.js'
import { GasTooLowError } from '../transaction/GasTooLowError.js'
// State errors
import { StateRootNotFoundError } from '../state/StateRootNotFoundError.js'
import { AccountNotFoundError } from '../state/AccountNotFoundError.js'
import { StorageError } from '../state/StorageError.js'
// JSON-RPC errors
import { InvalidRequestError } from '../jsonrpc/InvalidRequestError.js'
import { MethodNotFoundError } from '../jsonrpc/MethodNotFoundError.js'
import { InvalidParamsError } from '../jsonrpc/InvalidParamsError.js'
import { InternalError } from '../jsonrpc/InternalError.js'
// Node errors
import { SnapshotNotFoundError } from '../node/SnapshotNotFoundError.js'
import { FilterNotFoundError } from '../node/FilterNotFoundError.js'
import { NodeNotReadyError } from '../node/NodeNotReadyError.js'

/**
 * Map of error tags to their TaggedError constructors.
 * Note: Some aliases are included to handle errors from @tevm/errors
 * which may use different _tag values than the Effect versions.
 * @type {Record<string, new (props: any) => any>}
 */
const errorMap = {
	// EVM execution errors
	InsufficientBalanceError,
	InsufficientFundsError,
	InvalidJumpError,
	InvalidOpcodeError,
	OutOfGasError,
	Revert: RevertError,
	RevertError,
	StackOverflowError,
	StackUnderflowError,
	// Transport errors
	ForkError,
	NetworkError,
	TimeoutError,
	// Block errors
	BlockNotFoundError,
	UnknownBlock: BlockNotFoundError,
	InvalidBlockError,
	BlockGasLimitExceededError,
	// Transaction errors
	InvalidTransactionError,
	InvalidTransaction: InvalidTransactionError,
	NonceTooLowError,
	NonceTooHighError,
	GasTooLowError,
	// State errors
	StateRootNotFoundError,
	AccountNotFoundError,
	AccountNotFound: AccountNotFoundError,
	StorageError,
	// JSON-RPC errors
	InvalidRequestError,
	InvalidRequest: InvalidRequestError,
	MethodNotFoundError,
	MethodNotFound: MethodNotFoundError,
	InvalidParamsError,
	InvalidParams: InvalidParamsError,
	InternalError,
	// Node errors
	SnapshotNotFoundError,
	FilterNotFoundError,
	NodeNotReadyError,
}

/**
 * Converts a BaseError from @tevm/errors to a TaggedError from @tevm/errors-effect.
 *
 * This is useful for bridging between the Promise-based API and the Effect-based API.
 *
 * Note: Error-specific properties (address, gasUsed, opcode, etc.) will be extracted
 * from the source error if they exist. If the source error doesn't have structured
 * data, only the message will be preserved.
 *
 * @example
 * ```typescript
 * import { toTaggedError } from '@tevm/errors-effect'
 * import { InsufficientBalanceError as BaseInsufficientBalanceError } from '@tevm/errors'
 * import { Effect } from 'effect'
 *
 * try {
 *   // Some operation that throws a BaseError
 * } catch (error) {
 *   const taggedError = toTaggedError(error)
 *
 *   // Now can use in Effect pipelines
 *   Effect.fail(taggedError)
 * }
 * ```
 *
 * @param {import('@tevm/errors').BaseError | Error | unknown} error - The error to convert
 * @returns {TevmError | InsufficientBalanceError | InsufficientFundsError | InvalidJumpError | OutOfGasError | RevertError | InvalidOpcodeError | StackOverflowError | StackUnderflowError | ForkError | NetworkError | TimeoutError | BlockNotFoundError | InvalidBlockError | BlockGasLimitExceededError | InvalidTransactionError | NonceTooLowError | NonceTooHighError | GasTooLowError | StateRootNotFoundError | AccountNotFoundError | StorageError | InvalidRequestError | MethodNotFoundError | InvalidParamsError | InternalError | SnapshotNotFoundError | FilterNotFoundError | NodeNotReadyError} A TaggedError instance
 */
export const toTaggedError = (error) => {
	// If it's already a TevmError TaggedError, return as-is
	if (error instanceof TevmError) {
		return error
	}

	// Check if already a known TaggedError type from this package
	// Note: We check using Object.values since instanceof checks work for
	// errors that were created with these exact constructors
	for (const ErrorClass of Object.values(errorMap)) {
		if (error instanceof ErrorClass) {
			return error
		}
	}

	// Handle BaseError from @tevm/errors (has _tag property but is not an Effect TaggedError)
	if (error && typeof error === 'object' && '_tag' in error) {
		const baseError = /** @type {import('@tevm/errors').BaseError & Record<string, unknown>} */ (error)
		const tag = baseError._tag

		// Check if we have a matching TaggedError class
		const ErrorClass = errorMap[tag]
		if (ErrorClass) {
			// Create a TaggedError with properties from the BaseError
			// Extract error-specific properties if they exist on the source
			// Note: We always preserve the cause property for proper error chaining

			// EVM errors
			if (tag === 'InsufficientBalanceError') {
				return new InsufficientBalanceError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					required: typeof baseError.required === 'bigint' ? baseError.required : undefined,
					available: typeof baseError.available === 'bigint' ? baseError.available : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InsufficientFundsError') {
				return new InsufficientFundsError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					required: typeof baseError.required === 'bigint' ? baseError.required : undefined,
					available: typeof baseError.available === 'bigint' ? baseError.available : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InvalidJumpError') {
				return new InvalidJumpError({
					destination: typeof baseError.destination === 'number' ? baseError.destination : undefined,
					pc: typeof baseError.pc === 'number' ? baseError.pc : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'OutOfGasError') {
				return new OutOfGasError({
					gasUsed: typeof baseError.gasUsed === 'bigint' ? baseError.gasUsed : undefined,
					gasLimit: typeof baseError.gasLimit === 'bigint' ? baseError.gasLimit : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'RevertError' || tag === 'Revert') {
				return new RevertError({
					// Original @tevm/errors uses 'raw' property, Effect version also uses 'raw'
					raw: typeof baseError.raw === 'string' ? /** @type {`0x${string}`} */ (baseError.raw) : undefined,
					reason: typeof baseError.reason === 'string' ? baseError.reason : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InvalidOpcodeError') {
				return new InvalidOpcodeError({
					opcode: typeof baseError.opcode === 'number' ? baseError.opcode : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'StackOverflowError') {
				return new StackOverflowError({
					stackSize: typeof baseError.stackSize === 'number' ? baseError.stackSize : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'StackUnderflowError') {
				return new StackUnderflowError({
					requiredItems: typeof baseError.requiredItems === 'number' ? baseError.requiredItems : undefined,
					availableItems: typeof baseError.availableItems === 'number' ? baseError.availableItems : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}

			// Transport errors
			if (tag === 'ForkError') {
				return new ForkError({
					method: typeof baseError.method === 'string' ? baseError.method : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'NetworkError') {
				return new NetworkError({
					url: typeof baseError.url === 'string' ? baseError.url : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'TimeoutError') {
				return new TimeoutError({
					timeout: typeof baseError.timeout === 'number' ? baseError.timeout : undefined,
					operation: typeof baseError.operation === 'string' ? baseError.operation : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}

			// Block errors
			if (tag === 'BlockNotFoundError' || tag === 'UnknownBlock') {
				return new BlockNotFoundError({
					blockTag: baseError.blockTag,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InvalidBlockError') {
				return new InvalidBlockError({
					blockNumber: typeof baseError.blockNumber === 'bigint' ? baseError.blockNumber : undefined,
					blockHash: typeof baseError.blockHash === 'string' ? /** @type {`0x${string}`} */ (baseError.blockHash) : undefined,
					reason: typeof baseError.reason === 'string' ? baseError.reason : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'BlockGasLimitExceededError') {
				return new BlockGasLimitExceededError({
					blockGasLimit: typeof baseError.blockGasLimit === 'bigint' ? baseError.blockGasLimit : undefined,
					gasUsed: typeof baseError.gasUsed === 'bigint' ? baseError.gasUsed : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}

			// Transaction errors
			if (tag === 'InvalidTransactionError' || tag === 'InvalidTransaction') {
				return new InvalidTransactionError({
					reason: typeof baseError.reason === 'string' ? baseError.reason : undefined,
					tx: baseError.tx,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'NonceTooLowError') {
				return new NonceTooLowError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					expected: typeof baseError.expected === 'bigint' ? baseError.expected : undefined,
					actual: typeof baseError.actual === 'bigint' ? baseError.actual : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'NonceTooHighError') {
				return new NonceTooHighError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					expected: typeof baseError.expected === 'bigint' ? baseError.expected : undefined,
					actual: typeof baseError.actual === 'bigint' ? baseError.actual : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'GasTooLowError') {
				return new GasTooLowError({
					gasLimit: typeof baseError.gasLimit === 'bigint' ? baseError.gasLimit : undefined,
					intrinsicGas: typeof baseError.intrinsicGas === 'bigint' ? baseError.intrinsicGas : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}

			// State errors
			if (tag === 'StateRootNotFoundError') {
				return new StateRootNotFoundError({
					stateRoot: typeof baseError.stateRoot === 'string' ? /** @type {`0x${string}`} */ (baseError.stateRoot) : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'AccountNotFoundError' || tag === 'AccountNotFound') {
				return new AccountNotFoundError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'StorageError') {
				return new StorageError({
					address: typeof baseError.address === 'string' ? /** @type {`0x${string}`} */ (baseError.address) : undefined,
					key: typeof baseError.key === 'string' ? /** @type {`0x${string}`} */ (baseError.key) : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}

			// JSON-RPC errors
			if (tag === 'InvalidRequestError' || tag === 'InvalidRequest') {
				return new InvalidRequestError({
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'MethodNotFoundError' || tag === 'MethodNotFound') {
				return new MethodNotFoundError({
					method: typeof baseError.method === 'string' ? baseError.method : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InvalidParamsError' || tag === 'InvalidParams') {
				return new InvalidParamsError({
					method: typeof baseError.method === 'string' ? baseError.method : undefined,
					params: baseError.params,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'InternalError') {
				return new InternalError({
					meta: baseError.meta,
					message: baseError.message,
					cause: baseError.cause,
				})
			}

			// Node errors
			if (tag === 'SnapshotNotFoundError') {
				return new SnapshotNotFoundError({
					snapshotId: typeof baseError.snapshotId === 'string' ? baseError.snapshotId : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'FilterNotFoundError') {
				return new FilterNotFoundError({
					filterId: typeof baseError.filterId === 'string' ? baseError.filterId : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
			if (tag === 'NodeNotReadyError') {
				return new NodeNotReadyError({
					reason: typeof baseError.reason === 'string' ? baseError.reason : undefined,
					message: baseError.message,
					cause: baseError.cause,
				})
			}
		}

		// Fall back to generic TevmError
		return new TevmError({
			message: baseError.message,
			code: baseError.code ?? 0,
			docsPath: baseError.docsPath,
			cause: baseError.cause,
		})
	}

	// Handle regular Error
	if (error instanceof Error) {
		return new TevmError({
			message: error.message,
			code: 0,
			cause: error,
		})
	}

	// Handle unknown errors
	return new TevmError({
		message: String(error),
		code: 0,
		cause: error,
	})
}
