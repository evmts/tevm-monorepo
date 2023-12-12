import type { Tevm } from '../../tevm.js'
import type { Abi } from 'abitype'
import type { TevmContractCallRequest } from './TevmContractCallRequest.js'
import type { TevmContractCallResponse } from './TevmContractCallResponse.js'

export type TevmContractCallGeneric = <
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
>(vm: Tevm, request: TevmContractCallRequest<TAbi, TFunctionName>) => Promise<
  TevmContractCallResponse<TAbi, TFunctionName>
>
