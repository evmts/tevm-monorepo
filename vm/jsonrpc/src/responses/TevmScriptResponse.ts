import type { RunScriptResult } from '@tevm/actions'
import type { Abi } from 'abitype'

export type TevmScriptResponse<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = {
	jsonrpc: '2.0'
	method: 'tevm_script'
	result: RunScriptResult<TAbi, TFunctionName>
	id?: string | number | null
}
