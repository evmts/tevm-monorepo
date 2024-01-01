import type { GenError } from './GenError.js'
import type { GenResult } from './GenResult.js'
import type { ContractResult } from '@tevm/api'
import type { Abi } from 'abitype'
import type {
	Chain,
	WaitForTransactionReceiptReturnType,
	WriteContractErrorType,
	WriteContractReturnType,
} from 'viem'

export type OptimisticResult<
	TAbi extends Abi | readonly unknown[],
	TFunctionName extends string,
	TChain extends Chain | undefined,
> =
	| GenResult<ContractResult<TAbi, TFunctionName>, 'OPTIMISTIC_RESULT'>
	// TODO type this error better
	| GenError<Error, 'OPTIMISTIC_RESULT'>
	| GenResult<WriteContractReturnType, 'HASH'>
	| GenError<WriteContractErrorType, 'HASH'>
	| GenResult<WaitForTransactionReceiptReturnType<TChain>, 'RECEIPT'>
	| GenError<WriteContractErrorType, 'RECEIPT'>
// TODO emit a finalized result when app considers risk of reorg to be 0
// | GenResult<undefined, 'FINALIZED'>
// TODO emit a reorg event
