import type { CallJsonRpcResponse } from './CallJsonRpcResponse.js'

/**
 * Since contract calls are just a quality of life wrapper around call we avoid using tevm_contract
 * in favor of overloading tevm_call
 */
export type ContractJsonRpcResponse = CallJsonRpcResponse
