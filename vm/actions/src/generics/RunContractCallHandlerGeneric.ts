import type { Tevm } from '../../Tevm.js'
import type { RunContractCallAction } from './RunContractCallAction.js'
import type { RunContractCallResult } from './RunContractCallResult.js'
import type { Abi } from 'abitype'

export type RunContractCallHandlerGeneric = <
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
>(
  tevm: Tevm,
  action: RunContractCallAction<TAbi, TFunctionName>,
) => Promise<RunContractCallResult<TAbi, TFunctionName>>
