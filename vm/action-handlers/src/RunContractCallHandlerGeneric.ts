import type { EVM } from '@ethereumjs/evm'
import type {
	RunContractCallAction,
	RunContractCallResponse,
} from '@tevm/actions'
import type { Abi } from 'abitype'

export type RunContractCallHandlerGeneric = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evm: EVM,
	action: RunContractCallAction<TAbi, TFunctionName>,
) => Promise<RunContractCallResponse<TAbi, TFunctionName>>
