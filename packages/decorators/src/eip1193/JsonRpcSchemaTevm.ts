// Use type-only interface definitions to avoid circular dependencies
type CallResult<T> = { data: string; events: any[]; [key: string]: any }
type GetAccountResult<T> = { address: string; balance: bigint; nonce: bigint; [key: string]: any }
type SetAccountResult<T> = { success: boolean }
type DumpStateResult<T> = { state: any }
type LoadStateResult<T> = { success: boolean }

type CallJsonRpcRequest = { params: [{ from?: string; to?: string; data?: string }] }
type DumpStateJsonRpcRequest = { params?: [] }
type GetAccountJsonRpcRequest = { params: [{ address: string }] }
type LoadStateJsonRpcRequest = { params: [{ state: any }] }
type SetAccountJsonRpcRequest = { params: [{ address: string; [key: string]: any }] }
import type { SerializeToJson } from '@tevm/utils'

export type JsonRpcSchemaTevm = {
	/**
	 * @description A versatile way of executing an EVM call with many options and detailed return data
	 * @link https://tevm.sh/learn/json-rpc/#tevm-methods
	 * @example
	 * provider.request({ method: 'tevm_call', params: [{ from: '0x...', to: '0x...', data: '0x...' }] })})
	 * // => { data: '0x...', events: [{...}], ... }
	 */
	tevm_call: {
		Method: 'tevm_call'
		Parameters: CallJsonRpcRequest['params']
		ReturnType: SerializeToJson<CallResult<never>>
	}
	/**
	 * @description Loads the provided state into the EVM
	 * @link https://tevm.sh/learn/json-rpc/#tevm-methods
	 * @example
	 * provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])})
	 * // => { success: true }
	 */
	tevm_loadState: {
		Method: 'tevm_loadState'
		Parameters: LoadStateJsonRpcRequest['params']
		ReturnType: SerializeToJson<LoadStateResult<never>>
	}
	/**
	 * @description Dumps the current cached state of the EVM.
	 * @link https://tevm.sh/learn/json-rpc/#tevm-methods
	 * @example
	 * provider.request({ method: 'tevm_dumpState' })})
	 */
	tevm_dumpState: {
		Method: 'tevm_dumpState'
		Parameters?: DumpStateJsonRpcRequest['params']
		ReturnType: SerializeToJson<DumpStateResult<never>>
	}
	/**
	 * @description Returns the account state of the given address
	 * @link https://tevm.sh/learn/json-rpc/#tevm-methods
	 * @example
	 * provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])})
	 */
	tevm_getAccount: {
		Method: 'tevm_getAccount'
		Parameters: GetAccountJsonRpcRequest['params']
		ReturnType: SerializeToJson<GetAccountResult<never>>
	}
	/**
   * @description Sets the account state of the given address
   * @link https://tevm.sh/learn/json-rpc/#tevm-methods
   * @example
   * provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])})
r  */
	tevm_setAccount: {
		Method: 'tevm_setAccount'
		Parameters: SetAccountJsonRpcRequest['params']
		ReturnType: SerializeToJson<SetAccountResult<never>>
	}
}
