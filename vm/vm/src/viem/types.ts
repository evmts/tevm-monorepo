import type { Abi } from 'abitype'
import type { NonVerboseTevmJsonRpcRequest } from '../jsonrpc/TevmJsonRpcRequest.js'
import type { BackendReturnType } from '../jsonrpc/createJsonRpcClient.js'
import type { RunScriptAction } from '../actions/runScript/RunScriptAction.js'
import type { RunScriptResult } from '../actions/runScript/RunScriptResult.js'
import type { PutAccountAction, PutContractCodeAction, RunCallAction } from '../actions/index.js'
import type { TevmPutAccountResponse } from '../jsonrpc/putAccount/TevmPutAccountResponse.js'
import type { TevmPutContractCodeResponse } from '../jsonrpc/putContractCode/TevmPutContractCodeResponse.js'
import type { TevmCallResponse } from '../jsonrpc/runCall/TevmCallResponse.js'
import type { RunContractCallAction } from '../actions/contractCall/RunContractCallAction.js'
import type { RunContractCallResult } from '../actions/contractCall/RunContractCallResult.js'

export type ViemTevmClient = {
  tevmRequest<T extends NonVerboseTevmJsonRpcRequest>(r: T): Promise<BackendReturnType<T>['result']>
  runScript<
    TAbi extends Abi | readonly unknown[] = Abi,
    TFunctionName extends string = string,
  >(
    action: RunScriptAction<TAbi, TFunctionName>,
  ): Promise<RunScriptResult<TAbi, TFunctionName>>
  putAccount(action: PutAccountAction): Promise<TevmPutAccountResponse['result']>
  putContractCode(
    action: PutContractCodeAction,
  ): Promise<TevmPutContractCodeResponse['result']>
  runCall(action: RunCallAction): Promise<TevmCallResponse['result']>
  runContractCall<
    TAbi extends Abi | readonly unknown[] = Abi,
    TFunctionName extends string = string,
  >(
    action: RunContractCallAction<TAbi, TFunctionName>,
  ): Promise<RunContractCallResult<TAbi, TFunctionName>>
}

export type ViemTevmClientDecorator = (client: Pick<import('viem').Client, 'request'>) => ViemTevmClient

export type ViemTevmExtension = () => ViemTevmClientDecorator

