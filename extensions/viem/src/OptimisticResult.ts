import type { GenError } from './GenError.js'
import type { GenResult } from './GenResult.js'
import type { ContractResult } from '@tevm/actions-types'
import type { Abi } from 'abitype'
import type {
	Chain,
	ContractFunctionName,
	WaitForTransactionReceiptReturnType,
	WriteContractErrorType,
	WriteContractReturnType,
} from 'viem'

// TODO move this to actions-types if it becomes a real action
/**
 * @experimental
 * The result of an optimistic write
 */
export type OptimisticResult<
	TAbi extends Abi | readonly unknown[],
	TFunctionName extends ContractFunctionName<TAbi>,
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
