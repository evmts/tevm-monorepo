import { formatGwei } from '../utils/unit/formatGwei.js'
import { BaseError } from './base.js'
/**
 * geth:    https://github.com/ethereum/go-ethereum/blob/master/core/error.go
 *          https://github.com/ethereum/go-ethereum/blob/master/core/types/transaction.go#L34-L41
 *
 * erigon:  https://github.com/ledgerwatch/erigon/blob/master/core/error.go
 *          https://github.com/ledgerwatch/erigon/blob/master/core/types/transaction.go#L41-L46
 *
 * anvil:   https://github.com/foundry-rs/foundry/blob/master/anvil/src/eth/error.rs#L108
 */
class ExecutionRevertedError extends BaseError {
	constructor({ cause, message } = {}) {
		const reason = message
			?.replace('execution reverted: ', '')
			?.replace('execution reverted', '')
		super(
			`Execution reverted ${
				reason ? `with reason: ${reason}` : 'for an unknown reason'
			}.`,
			{
				cause,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'ExecutionRevertedError',
		})
	}
}
Object.defineProperty(ExecutionRevertedError, 'code', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 3,
})
Object.defineProperty(ExecutionRevertedError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /execution reverted/,
})
export { ExecutionRevertedError }
class FeeCapTooHighError extends BaseError {
	constructor({ cause, maxFeePerGas } = {}) {
		super(
			`The fee cap (\`maxFeePerGas\`${
				maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''
			}) cannot be higher than the maximum allowed value (2^256-1).`,
			{
				cause,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'FeeCapTooHigh',
		})
	}
}
Object.defineProperty(FeeCapTooHighError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/,
})
export { FeeCapTooHighError }
class FeeCapTooLowError extends BaseError {
	constructor({ cause, maxFeePerGas } = {}) {
		super(
			`The fee cap (\`maxFeePerGas\`${
				maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ''
			} gwei) cannot be lower than the block base fee.`,
			{
				cause,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'FeeCapTooLow',
		})
	}
}
Object.defineProperty(FeeCapTooLowError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value:
		/max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/,
})
export { FeeCapTooLowError }
class NonceTooHighError extends BaseError {
	constructor({ cause, nonce } = {}) {
		super(
			`Nonce provided for the transaction ${
				nonce ? `(${nonce}) ` : ''
			}is higher than the next one expected.`,
			{ cause },
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'NonceTooHighError',
		})
	}
}
Object.defineProperty(NonceTooHighError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce too high/,
})
export { NonceTooHighError }
class NonceTooLowError extends BaseError {
	constructor({ cause, nonce } = {}) {
		super(
			[
				`Nonce provided for the transaction ${
					nonce ? `(${nonce}) ` : ''
				}is lower than the current nonce of the account.`,
				'Try increasing the nonce or find the latest nonce with `getTransactionCount`.',
			].join('\n'),
			{ cause },
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'NonceTooLowError',
		})
	}
}
Object.defineProperty(NonceTooLowError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce too low|transaction already imported|already known/,
})
export { NonceTooLowError }
class NonceMaxValueError extends BaseError {
	constructor({ cause, nonce } = {}) {
		super(
			`Nonce provided for the transaction ${
				nonce ? `(${nonce}) ` : ''
			}exceeds the maximum allowed nonce.`,
			{ cause },
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'NonceMaxValueError',
		})
	}
}
Object.defineProperty(NonceMaxValueError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /nonce has max value/,
})
export { NonceMaxValueError }
class InsufficientFundsError extends BaseError {
	constructor({ cause } = {}) {
		super(
			[
				'The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.',
			].join('\n'),
			{
				cause,
				metaMessages: [
					'This error could arise when the account does not have enough funds to:',
					' - pay for the total gas fee,',
					' - pay for the value to send.',
					' ',
					'The cost of the transaction is calculated as `gas * gas fee + value`, where:',
					' - `gas` is the amount of gas needed for transaction to execute,',
					' - `gas fee` is the gas fee,',
					' - `value` is the amount of ether to send to the recipient.',
				],
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'InsufficientFundsError',
		})
	}
}
Object.defineProperty(InsufficientFundsError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /insufficient funds/,
})
export { InsufficientFundsError }
class IntrinsicGasTooHighError extends BaseError {
	constructor({ cause, gas } = {}) {
		super(
			`The amount of gas ${
				gas ? `(${gas}) ` : ''
			}provided for the transaction exceeds the limit allowed for the block.`,
			{
				cause,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'IntrinsicGasTooHighError',
		})
	}
}
Object.defineProperty(IntrinsicGasTooHighError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /intrinsic gas too high|gas limit reached/,
})
export { IntrinsicGasTooHighError }
class IntrinsicGasTooLowError extends BaseError {
	constructor({ cause, gas } = {}) {
		super(
			`The amount of gas ${
				gas ? `(${gas}) ` : ''
			}provided for the transaction is too low.`,
			{
				cause,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'IntrinsicGasTooLowError',
		})
	}
}
Object.defineProperty(IntrinsicGasTooLowError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /intrinsic gas too low/,
})
export { IntrinsicGasTooLowError }
class TransactionTypeNotSupportedError extends BaseError {
	constructor({ cause }) {
		super('The transaction type is not supported for this chain.', {
			cause,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'TransactionTypeNotSupportedError',
		})
	}
}
Object.defineProperty(TransactionTypeNotSupportedError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value: /transaction type not valid/,
})
export { TransactionTypeNotSupportedError }
class TipAboveFeeCapError extends BaseError {
	constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
		super(
			[
				`The provided tip (\`maxPriorityFeePerGas\`${
					maxPriorityFeePerGas
						? ` = ${formatGwei(maxPriorityFeePerGas)} gwei`
						: ''
				}) cannot be higher than the fee cap (\`maxFeePerGas\`${
					maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''
				}).`,
			].join('\n'),
			{
				cause,
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'TipAboveFeeCapError',
		})
	}
}
Object.defineProperty(TipAboveFeeCapError, 'nodeMessage', {
	enumerable: true,
	configurable: true,
	writable: true,
	value:
		/max priority fee per gas higher than max fee per gas|tip higher than fee cap/,
})
export { TipAboveFeeCapError }
export class UnknownNodeError extends BaseError {
	constructor({ cause }) {
		super(`An error occurred while executing: ${cause?.shortMessage}`, {
			cause,
		})
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'UnknownNodeError',
		})
	}
}
//# sourceMappingURL=node.js.map
