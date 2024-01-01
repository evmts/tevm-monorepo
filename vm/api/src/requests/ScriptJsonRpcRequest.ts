import type { ScriptParams } from '../index.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { Abi } from 'abitype'

export type ScriptJsonRpcRequest<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
> = JsonRpcRequest<'tevm_script', ScriptParams<TAbi, TFunctionName>>
