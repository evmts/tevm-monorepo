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
	TevmCallResponse,
	TevmJsonRpcRequest,
	TevmPutAccountResponse,
	TevmPutContractCodeResponse,
} from '@tevm/jsonrpc'
import type { Abi } from 'abitype'

export type Client = {
	request<T extends TevmJsonRpcRequest>(r: T): Promise<BackendReturnType<T>>
	runScript<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunScriptAction<TAbi, TFunctionName>,
	): Promise<RunScriptResponse<TAbi, TFunctionName>>
	putAccount(action: PutAccountAction): Promise<TevmPutAccountResponse>
	putContractCode(
		action: PutContractCodeAction,
	): Promise<TevmPutContractCodeResponse>
	runCall(action: RunCallAction): Promise<TevmCallResponse>
	runContractCall<
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunContractCallAction<TAbi, TFunctionName>,
	): Promise<RunContractCallResponse<TAbi, TFunctionName>>
}
