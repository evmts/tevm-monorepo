import type {
	PutAccountAction,
	PutAccountResponse,
	PutContractCodeAction,
	PutContractCodeResponse,
	RunCallAction,
	RunCallResponse,
	RunContractCallAction,
	RunContractCallResponse,
	RunScriptAction,
	RunScriptResponse,
} from '@tevm/actions'
import type { BackendReturnType, TevmJsonRpcRequest } from '@tevm/jsonrpc'
import type { Abi } from 'abitype'
import { JsonRpcProvider } from 'ethers'
import type { BigNumberish, BytesLike, Numeric } from 'ethers'
import { parse, stringify } from 'superjson'

export interface AccountState {
	balance?: BigNumberish
	code?: BytesLike
	nonce?: Numeric
}

const asSuperJson = (value: object) => JSON.parse(stringify(value))
const parseSuperJson = (value: { result?: any }) => parse(JSON.stringify(value))

export class TevmJsonRpcProvider extends JsonRpcProvider {
	public readonly tevmRequest = <T extends TevmJsonRpcRequest>(
		r: T,
	): Promise<BackendReturnType<T>> => {
		return this.send(r.method, r.params)
	}

	public readonly runScript = <
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunScriptAction<TAbi, TFunctionName>,
	): Promise<RunScriptResponse<TAbi, TFunctionName>> => {
		return this.tevmRequest({
			jsonrpc: '2.0',
			id: 1,
			method: 'tevm_script',
			params: asSuperJson(action),
		}).then(parseSuperJson) as any
	}

	public readonly putAccount = (
		action: PutAccountAction,
	): Promise<PutAccountResponse> => {
		return this.tevmRequest({
			jsonrpc: '2.0',
			id: 1,
			method: 'tevm_putAccount',
			params: asSuperJson(action),
		}).then(parseSuperJson) as any
	}

	public readonly putContractCode = (
		action: PutContractCodeAction,
	): Promise<PutContractCodeResponse> => {
		return this.tevmRequest({
			jsonrpc: '2.0',
			id: 1,
			method: 'tevm_putContractCode',
			params: asSuperJson(action),
		}).then(parseSuperJson) as any
	}

	public readonly runCall = (
		action: RunCallAction,
	): Promise<RunCallResponse> => {
		return this.tevmRequest({
			jsonrpc: '2.0',
			id: 1,
			method: 'tevm_call',
			params: asSuperJson(action),
		}).then(parseSuperJson) as any
	}

	public readonly runContractCall = <
		TAbi extends Abi | readonly unknown[] = Abi,
		TFunctionName extends string = string,
	>(
		action: RunContractCallAction<TAbi, TFunctionName>,
	): Promise<RunContractCallResponse<TAbi, TFunctionName>> => {
		return this.tevmRequest({
			jsonrpc: '2.0',
			id: 1,
			method: 'tevm_contractCall',
			params: asSuperJson(action),
		}).then(parseSuperJson) as any
	}
}
