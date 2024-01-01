import type { ScriptParams, ScriptResult } from '../index.js'
import type { Abi } from 'abitype'

export type ScriptHandler = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	params: ScriptParams<TAbi, TFunctionName>,
) => Promise<ScriptResult<TAbi, TFunctionName>>
