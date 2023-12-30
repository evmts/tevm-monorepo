import type { RunContractCallResult } from '../../actions/contractCall/RunContractCallResult.js'
import type { Abi } from 'abitype'

export type TevmContractCallResponse<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = {
	jsonrpc: '2.0'
	method: 'tevm_contractCall'
	result: RunContractCallResult<TAbi, TFunctionName>
	id?: string | number | null
}
