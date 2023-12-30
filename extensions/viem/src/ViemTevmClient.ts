import type {
	PutAccountAction,
	PutContractCodeAction,
	RunCallAction,
	RunContractCallAction,
	RunContractCallResponse,
	RunScriptAction,
	RunScriptResponse,
} from '@tevm/actions'
import type {
	BackendReturnType,
	NonVerboseTevmJsonRpcRequest,
	TevmCallResponse,
	TevmPutAccountResponse,
	TevmPutContractCodeResponse,
} from '@tevm/jsonrpc'
import type { Abi } from 'abitype'

export type ViemTevmClient = {
	tevmRequest<T extends NonVerboseTevmJsonRpcRequest>(
		r: T,
	): Promise<BackendReturnType<T>['result']>
	runScript<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunScriptAction<TAbi, TFunctionName>,
	): Promise<RunScriptResponse<TAbi, TFunctionName>>
	putAccount(
		action: PutAccountAction,
	): Promise<TevmPutAccountResponse['result']>
	putContractCode(
		action: PutContractCodeAction,
	): Promise<TevmPutContractCodeResponse['result']>
	runCall(action: RunCallAction): Promise<TevmCallResponse['result']>
	runContractCall<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunContractCallAction<TAbi, TFunctionName>,
	): Promise<RunContractCallResponse<TAbi, TFunctionName>>
}
