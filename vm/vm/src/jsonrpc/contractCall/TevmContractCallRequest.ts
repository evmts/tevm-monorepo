import type { Abi } from 'abitype'
import type { RunContractCallAction } from '../../actions/contractCall/RunContractCallAction.js'

export type TevmContractCallRequest<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = {
  params: RunContractCallAction<TAbi, TFunctionName>,
  jsonrpc: '2.0',
  method: 'tevm_contractCall',
  id?: string | number | null,
}

