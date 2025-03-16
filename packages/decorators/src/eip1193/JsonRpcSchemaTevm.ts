import type { CallResult, GetAccountResult, SetAccountResult } from '@tevm/actions'
import type { DumpStateResult, LoadStateResult } from '@tevm/actions'
import type {
	CallJsonRpcRequest,
	DumpStateJsonRpcRequest,
	GetAccountJsonRpcRequest,
	LoadStateJsonRpcRequest,
	SetAccountJsonRpcRequest,
} from '@tevm/actions'
import type { SerializeToJson } from '@tevm/utils'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { JsonRpcSchemaTevm } from '[package-path]'
 *
 * const value: JsonRpcSchemaTevm = {
 *   // Initialize properties
 * }
 * ```
 */
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
