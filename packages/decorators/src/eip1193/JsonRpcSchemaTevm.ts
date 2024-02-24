// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes 
import type { CallJsonRpcRequest, CallJsonRpcResponse, DumpStateJsonRpcRequest, DumpStateJsonRpcResponse, GetAccountJsonRpcRequest, GetAccountJsonRpcResponse, LoadStateJsonRpcRequest, LoadStateJsonRpcResponse, ScriptJsonRpcRequest, ScriptJsonRpcResponse, SetAccountJsonRpcRequest, SetAccountJsonRpcResponse } from '@tevm/procedures-types'

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
    Parameters: CallJsonRpcRequest
    ReturnType: CallJsonRpcResponse
  },
  /**
   * @description Execute supplied contract bytecode on the EVM
   * @link https://tevm.sh/learn/json-rpc/#tevm-methods
   * @example
   * provider.request({ method: 'tevm_script', params: [{ deployedBytecode: '0x...', args: [...] }] })})
   * // => { address: '0x...', events: [{...}], ... }
   */
  tevm_script: {
    Method: 'tevm_script',
    Parameters: ScriptJsonRpcRequest,
    ReturnType: ScriptJsonRpcResponse
  },
  /**
   * @description Loads the provided state into the EVM
   * @link https://tevm.sh/learn/json-rpc/#tevm-methods
   * @example
   * provider.request({ method: 'tevm_loadState', params: [{ state: {...} }] }])})
   * // => { success: true }
   */
  tevm_loadState: {
    Method: 'tevm_loadState',
    Parameters: LoadStateJsonRpcRequest,
    ReturnType: LoadStateJsonRpcResponse
  },
  /**
   * @description Dumps the current cached state of the EVM.
   * @link https://tevm.sh/learn/json-rpc/#tevm-methods
   * @example
   * provider.request({ method: 'tevm_dumpState' })})
   */
  tevm_dumpState: {
    Method: 'tevm_dumpState',
    Parameters?: DumpStateJsonRpcRequest,
    ReturnType: DumpStateJsonRpcResponse
  },
  /**
   * @description Returns the account state of the given address
   * @link https://tevm.sh/learn/json-rpc/#tevm-methods
   * @example
   * provider.request({ method: 'tevm_getAccount', params: [{address: '0x...' }])})
   */
  tevm_getAccount: {
    Method: 'tevm_getAccount',
    Parameters: GetAccountJsonRpcRequest,
    ReturnType: GetAccountJsonRpcResponse
  },
  /**
   * @description Sets the account state of the given address
   * @link https://tevm.sh/learn/json-rpc/#tevm-methods
   * @example
   * provider.request({ method: 'tevm_setAccount', params: [{address: '0x...', value: '0x42' }])})
   */
  tevm_setAccount: {
    Method: 'tevm_setAccount',
    Parameters: SetAccountJsonRpcRequest,
    ReturnType: SetAccountJsonRpcResponse
  }
}

