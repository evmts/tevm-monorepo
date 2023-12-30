import type { TevmContractCallRequest } from '../requests/index.js'
import type { TevmContractCallResponse } from '../responses/index.js'
import type { EVM } from '@ethereumjs/evm'
import type { Abi } from 'abitype'

export type TevmContractCallGeneric = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evm: EVM,
	request: TevmContractCallRequest<TAbi, TFunctionName>,
) => Promise<TevmContractCallResponse<TAbi, TFunctionName>>
