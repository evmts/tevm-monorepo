import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction.js'
import { BaseError } from '../../errors/base.js'
import {
	ExecutionRevertedError,
	FeeCapTooHighError,
	FeeCapTooLowError,
	InsufficientFundsError,
	IntrinsicGasTooHighError,
	IntrinsicGasTooLowError,
	NonceMaxValueError,
	NonceTooHighError,
	NonceTooLowError,
	TipAboveFeeCapError,
	TransactionTypeNotSupportedError,
	UnknownNodeError,
} from '../../errors/node.js'
export declare function containsNodeError(err: BaseError): boolean
export type GetNodeErrorParameters = Partial<SendTransactionParameters<any>>
export declare function getNodeError(
	err: BaseError,
	args: GetNodeErrorParameters,
):
	| ExecutionRevertedError
	| FeeCapTooHighError
	| FeeCapTooLowError
	| NonceTooHighError
	| NonceTooLowError
	| NonceMaxValueError
	| InsufficientFundsError
	| IntrinsicGasTooHighError
	| IntrinsicGasTooLowError
	| TransactionTypeNotSupportedError
	| TipAboveFeeCapError
	| UnknownNodeError
//# sourceMappingURL=getNodeError.d.ts.map
