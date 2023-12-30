import type { Tevm } from '../../Tevm.js'
import type { TevmContractCallRequest } from '../requests/index.js'
import type { TevmContractCallResponse } from '../responses/index.js'
import type { Abi } from 'abitype'

export type TevmContractCallGeneric = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	vm: Tevm,
	request: TevmContractCallRequest<TAbi, TFunctionName>,
) => Promise<TevmContractCallResponse<TAbi, TFunctionName>>
