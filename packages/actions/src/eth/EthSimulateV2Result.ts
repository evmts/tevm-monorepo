import type { Address, Hex } from '../common/index.js'

/**
 * Access list entry
 */
export type AccessListEntry = {
	readonly address: Address
	readonly storageKeys: ReadonlyArray<Hex>
}

/**
 * Log entry from transaction execution
 */
export type SimulationLog = {
	readonly address: Address
	readonly topics: ReadonlyArray<Hex>
	readonly data: Hex
	readonly blockNumber?: Hex
	readonly transactionHash?: Hex
	readonly transactionIndex?: Hex
	readonly blockHash?: Hex
	readonly logIndex?: Hex
	readonly removed?: boolean
}

/**
 * Call trace entry
 */
export type CallTrace = {
	readonly type: 'CALL' | 'STATICCALL' | 'DELEGATECALL' | 'CALLCODE' | 'CREATE' | 'CREATE2' | 'SUICIDE'
	readonly from: Address
	readonly to?: Address
	readonly value?: Hex
	readonly gas: Hex
	readonly gasUsed: Hex
	readonly input: Hex
	readonly output?: Hex
	readonly error?: string
	readonly calls?: ReadonlyArray<CallTrace>
}

/**
 * State diff entry
 */
export type StateDiffEntry = {
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
}

/**
 * VM trace operation
 */
export type VmTraceOp = {
	readonly pc: number
	readonly op: string
	readonly gas: Hex
	readonly gasCost: Hex
	readonly depth: number
	readonly stack?: ReadonlyArray<Hex>
	readonly memory?: Hex
	readonly memSize?: number
	readonly storage?: Record<Hex, Hex>
}

/**
 * VM trace for a transaction
 */
export type VmTrace = {
	readonly ops: ReadonlyArray<VmTraceOp>
}

/**
 * Transaction receipt
 */
export type SimulationReceipt = {
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
	readonly logs: ReadonlyArray<SimulationLog>
	readonly logsBloom: Hex
	readonly status: Hex
	readonly type?: Hex
}

/**
 * Result of simulating a single transaction call
 */
export type SimulationCallResult = {
	/**
	 * Return data from the call
	 */
	readonly returnValue: Hex
	/**
	 * Gas used by the call
	 */
	readonly gasUsed: Hex
	/**
	 * Logs emitted by the call
	 */
	readonly logs: ReadonlyArray<SimulationLog>
	/**
	 * Call trace (if requested)
	 */
	readonly trace?: CallTrace
	/**
	 * State diff (if requested)
	 */
	readonly stateDiff?: Record<Address, StateDiffEntry>
	/**
	 * VM trace (if requested)
	 */
	readonly vmTrace?: VmTrace
	/**
	 * Transaction receipt (if requested)
	 */
	readonly receipt?: SimulationReceipt
	/**
	 * Error message if call failed
	 */
	readonly error?: string
	/**
	 * Revert reason if call reverted
	 */
	readonly revert?: string
}

/**
 * Result of eth_simulateV2 call
 */
export type EthSimulateV2Result = {
	/**
	 * Results for each simulated call
	 */
	readonly results: ReadonlyArray<SimulationCallResult>
	/**
	 * Block number the simulation was executed against
	 */
	readonly blockNumber: Hex
	/**
	 * Block hash the simulation was executed against
	 */
	readonly blockHash: Hex
	/**
	 * Block timestamp
	 */
	readonly timestamp: Hex
	/**
	 * Base fee per gas used in simulation
	 */
	readonly baseFeePerGas?: Hex
}