import type { Tevm } from '../../tevm.js'
import type { Abi } from 'abitype'
import type { RunContractCallAction } from './RunContractCallAction.js'
import type { RunContractCallResult } from './RunContractCallResult.js'

export type TevmContractCallGeneric = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(vm: Tevm, request: {
	params: RunContractCallAction<TAbi, TFunctionName>,
	jsonrpc: '2.0',
	method: 'tevm_contractCall',
	id?: string | number | null,
}) => Promise<
	{
		jsonrpc: '2.0',
		method: 'tevm_contractCall',
		result: RunContractCallResult<TAbi, TFunctionName>,
		id?: string | number | null,
	}
>

