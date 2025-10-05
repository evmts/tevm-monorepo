import type { Address, BlockOverrideSet, BlockParam, Hex, StateOverrideSet } from '../common/index.js'

/**
 * Transaction simulation call for eth_simulateV2
 */
export type SimulationCall = {
	/**
	 * The address from which the transaction is sent. Defaults to zero address
	 */
	readonly from?: Address
	/**
	 * The address to which the transaction is addressed. For contract creation, omit this field
	 */
	readonly to?: Address
	/**
	 * The integer of gas provided for the transaction execution
	 */
	readonly gas?: bigint
	/**
	 * The integer of gasPrice used for each paid gas
	 */
	readonly gasPrice?: bigint
	/**
	 * The max fee per gas for EIP-1559 transactions
	 */
	readonly maxFeePerGas?: bigint
	/**
	 * The max priority fee per gas for EIP-1559 transactions
	 */
	readonly maxPriorityFeePerGas?: bigint
	/**
	 * The integer of value sent with this transaction
	 */
	readonly value?: bigint
	/**
	 * The hash of the method signature and encoded parameters
	 */
	readonly data?: Hex
	/**
	 * Access list for EIP-2930 transactions
	 */
	readonly accessList?: Array<{
		address: Address
		storageKeys: Array<Hex>
	}>
	/**
	 * Transaction type (0x0 for legacy, 0x1 for EIP-2930, 0x2 for EIP-1559)
	 */
	readonly type?: Hex
}

/**
 * Block override parameters for simulation
 */
export type SimulationBlockOverrides = {
	/**
	 * Block number to simulate at
	 */
	readonly number?: bigint
	/**
	 * Block timestamp
	 */
	readonly time?: bigint
	/**
	 * Block gas limit
	 */
	readonly gasLimit?: bigint
	/**
	 * Block base fee per gas
	 */
	readonly baseFeePerGas?: bigint
	/**
	 * Block difficulty
	 */
	readonly difficulty?: bigint
	/**
	 * Block coinbase/miner address
	 */
	readonly coinbase?: Address
	/**
	 * Block mix hash
	 */
	readonly mixhash?: Hex
}

/**
 * Trace options for simulation results
 */
export type SimulationTraceConfig = {
	/**
	 * Enable call traces
	 */
	readonly trace?: boolean
	/**
	 * Enable state diff traces
	 */
	readonly stateDiff?: boolean
	/**
	 * Enable VM traces (detailed step-by-step execution)
	 */
	readonly vmTrace?: boolean
}

/**
 * Validation options for simulation
 */
export type SimulationValidation = {
	/**
	 * Validate transaction signature
	 */
	readonly signature?: boolean
	/**
	 * Validate account balance for value transfer
	 */
	readonly balance?: boolean
	/**
	 * Validate account nonce
	 */
	readonly nonce?: boolean
}

/**
 * Parameters for eth_simulateV2 call
 */
export type EthSimulateV2Params = {
	/**
	 * Array of transaction calls to simulate
	 */
	readonly calls: ReadonlyArray<SimulationCall>
	/**
	 * Block parameter to simulate from (defaults to 'latest')
	 */
	readonly blockTag?: BlockParam
	/**
	 * State overrides to apply before simulation
	 */
	readonly stateOverrides?: StateOverrideSet
	/**
	 * Block overrides for simulation environment
	 */
	readonly blockOverrides?: SimulationBlockOverrides
	/**
	 * Tracing configuration
	 */
	readonly traceConfig?: SimulationTraceConfig
	/**
	 * Validation configuration
	 */
	readonly validation?: SimulationValidation
	/**
	 * Whether to include full transaction receipts
	 */
	readonly includeReceipts?: boolean
}