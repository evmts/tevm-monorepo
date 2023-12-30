import type { EVM } from '@ethereumjs/evm'
import type { Abi } from 'abitype'
import type { RunContractCallAction, RunContractCallResult } from '../index.js'

export type RunContractCallHandlerGeneric = <
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
>(
  evm: EVM,
  action: RunContractCallAction<TAbi, TFunctionName>,
) => Promise<RunContractCallResult<TAbi, TFunctionName>>
