import type { Abi } from 'abitype'
import type { RunContractCallAction, RunContractCallResult, Tevm } from '@tevm/vm'

export type TevmContractCall = <
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

export const tevmContractCall: TevmContractCall = async (vm: Tevm, request) => {
  return {
    jsonrpc: '2.0',
    result: await vm.runContractCall(request.params),
    method: 'tevm_contractCall',
    ...(request.id === undefined ? {} : { id: request.id })
  }
}
