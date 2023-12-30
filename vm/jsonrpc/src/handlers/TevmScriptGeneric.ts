import type { TevmScriptRequest } from '../requests/index.js'
import type { TevmScriptResponse } from '../responses/index.js'
import type { EVM } from '@ethereumjs/evm'
import type { Abi } from 'abitype'

export type TevmScriptGeneric = <
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
>(
	evm: EVM,
	request: TevmScriptRequest<TAbi, TFunctionName>,
) => Promise<TevmScriptResponse<TAbi, TFunctionName>>
