import type { JsonRpcRequest, JsonRpcResponse } from '@tevm/jsonrpc'
import type { Address, Hex } from '@tevm/utils'

/**
 * JSON-RPC transaction call for eth_simulateV2
 */
export type JsonRpcSimulationCall = {
	/**
	 * The address from which the transaction is sent
	 */
	readonly from?: Address
	/**
	 * The address to which the transaction is addressed
	 */
	readonly to?: Address
	/**
	 * The integer of gas provided for the transaction execution
	 */
	readonly gas?: Hex
	/**
	 * The integer of gasPrice used for each paid gas
	 */
	readonly gasPrice?: Hex
	/**
	 * The max fee per gas for EIP-1559 transactions
	 */
	readonly maxFeePerGas?: Hex
	/**
	 * The max priority fee per gas for EIP-1559 transactions
	 */
	readonly maxPriorityFeePerGas?: Hex
	/**
	 * The integer of value sent with this transaction
	 */
	readonly value?: Hex
	/**
	 * The hash of the method signature and encoded parameters
	 */
	readonly data?: Hex
	/**
	 * Access list for EIP-2930 transactions
	 */
	readonly accessList?: ReadonlyArray<{
		address: Address
		storageKeys: ReadonlyArray<Hex>
	}>
	/**
	 * Transaction type (0x0 for legacy, 0x1 for EIP-2930, 0x2 for EIP-1559)
	 */
	readonly type?: Hex
}

/**
 * JSON-RPC block override parameters
 */
export type JsonRpcBlockOverrides = {
	readonly number?: Hex
	readonly time?: Hex
	readonly gasLimit?: Hex
	readonly baseFeePerGas?: Hex
	readonly difficulty?: Hex
	readonly coinbase?: Address
	readonly mixhash?: Hex
}

/**
 * JSON-RPC trace configuration
 */
export type JsonRpcTraceConfig = {
	readonly trace?: boolean
	readonly stateDiff?: boolean
	readonly vmTrace?: boolean
}

/**
 * JSON-RPC validation configuration
 */
export type JsonRpcValidation = {
	readonly signature?: boolean
	readonly balance?: boolean
	readonly nonce?: boolean
}

/**
 * JSON-RPC simulation parameters
 */
export type JsonRpcSimulateV2Params = {
	readonly calls: ReadonlyArray<JsonRpcSimulationCall>
	readonly blockTag?: Hex | 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'
	readonly stateOverrides?: Record<Address, {
		balance?: Hex
		nonce?: Hex
		code?: Hex
		state?: Record<Hex, Hex>
		stateDiff?: Record<Hex, Hex>
	}>
	readonly blockOverrides?: JsonRpcBlockOverrides
	readonly traceConfig?: JsonRpcTraceConfig
	readonly validation?: JsonRpcValidation
	readonly includeReceipts?: boolean
}

/**
 * JSON-RPC simulation call result
 */
export type JsonRpcSimulationCallResult = {
	readonly returnValue: Hex
	readonly gasUsed: Hex
	readonly logs: ReadonlyArray<{
		readonly address: Address
		readonly topics: ReadonlyArray<Hex>
		readonly data: Hex
		readonly blockNumber?: Hex
		readonly transactionHash?: Hex
		readonly transactionIndex?: Hex
		readonly blockHash?: Hex
		readonly logIndex?: Hex
		readonly removed?: boolean
	}>
	readonly trace?: {
		readonly type: 'CALL' | 'STATICCALL' | 'DELEGATECALL' | 'CALLCODE' | 'CREATE' | 'CREATE2' | 'SUICIDE'
		readonly from: Address
		readonly to?: Address
		readonly value?: Hex
		readonly gas: Hex
		readonly gasUsed: Hex
		readonly input: Hex
		readonly output?: Hex
		readonly error?: string
		readonly calls?: ReadonlyArray<any>
	}
	readonly stateDiff?: Record<Address, {
		readonly balance?: {
			readonly from?: Hex
			readonly to?: Hex
		}
		readonly nonce?: {
			readonly from?: Hex
			readonly to?: Hex
		}
		readonly code?: {
			readonly from?: Hex
			readonly to?: Hex
		}
		readonly storage?: Record<Hex, {
			readonly from?: Hex
			readonly to?: Hex
		}>
	}>
	readonly vmTrace?: {
		readonly ops: ReadonlyArray<{
			readonly pc: number
			readonly op: string
			readonly gas: Hex
			readonly gasCost: Hex
			readonly depth: number
			readonly stack?: ReadonlyArray<Hex>
			readonly memory?: Hex
			readonly memSize?: number
			readonly storage?: Record<Hex, Hex>
		}>
	}
	readonly receipt?: {
		readonly transactionHash?: Hex
		readonly transactionIndex?: Hex
		readonly blockHash?: Hex
		readonly blockNumber?: Hex
		readonly from: Address
		readonly to?: Address
		readonly cumulativeGasUsed: Hex
		readonly gasUsed: Hex
		readonly effectiveGasPrice: Hex
		readonly contractAddress?: Address
		readonly logs: ReadonlyArray<any>
		readonly logsBloom: Hex
		readonly status: Hex
		readonly type?: Hex
	}
	readonly error?: string
	readonly revert?: string
}

/**
 * JSON-RPC eth_simulateV2 result
 */
export type JsonRpcSimulateV2Result = {
	readonly results: ReadonlyArray<JsonRpcSimulationCallResult>
	readonly blockNumber: Hex
	readonly blockHash: Hex
	readonly timestamp: Hex
	readonly baseFeePerGas?: Hex
}

/**
 * JSON-RPC request for eth_simulateV2
 */
export type EthSimulateV2JsonRpcRequest = JsonRpcRequest<'eth_simulateV2', readonly [JsonRpcSimulateV2Params]>

/**
 * JSON-RPC response for eth_simulateV2
 */
export type EthSimulateV2JsonRpcResponse = JsonRpcResponse<'eth_simulateV2', JsonRpcSimulateV2Result, string>

/**
 * JSON-RPC procedure type for eth_simulateV2
 */
export type EthSimulateV2JsonRpcProcedure = (
	request: EthSimulateV2JsonRpcRequest,
) => Promise<EthSimulateV2JsonRpcResponse>