import type { Address } from './Address.js'
import type { Hex } from './Hex.js'

/**
 * Action details for a call trace entry
 */
export type FlatCallAction = {
	/** The type of call */
	callType?: 'call' | 'delegatecall' | 'staticcall'
	/** Sender address */
	from: Address
	/** Recipient address */
	to: Address
	/** Gas provided */
	gas: bigint
	/** Input data */
	input: Hex
	/** Value transferred */
	value: bigint
}

/**
 * Action details for a create trace entry
 */
export type FlatCreateAction = {
	/** Sender address */
	from: Address
	/** Gas provided */
	gas: bigint
	/** Init code */
	init: Hex
	/** Value transferred */
	value: bigint
}

/**
 * Result of a call trace entry
 */
export type FlatCallResult = {
	/** Gas used */
	gasUsed: bigint
	/** Output data */
	output: Hex
}

/**
 * Result of a create trace entry
 */
export type FlatCreateResult = {
	/** Created contract address */
	address: Address
	/** Deployed code */
	code: Hex
	/** Gas used */
	gasUsed: bigint
}

/**
 * A single trace entry in the flat trace array
 */
export type FlatTraceEntry = {
	/** Action details */
	action: FlatCallAction | FlatCreateAction
	/** Block hash where the transaction occurred */
	blockHash?: Hex
	/** Block number where the transaction occurred */
	blockNumber?: bigint
	/** Error message if the call failed */
	error?: string
	/** Revert reason if the call reverted */
	revertReason?: string
	/** Result of the action (null if call failed) */
	result: FlatCallResult | FlatCreateResult | null
	/** Number of child traces */
	subtraces: number
	/** Position in the trace tree as an array of indices */
	traceAddress: number[]
	/** Transaction hash */
	transactionHash?: Hex
	/** Transaction index in the block */
	transactionPosition?: number
	/** Type of trace: "call" or "create" */
	type: 'call' | 'create' | 'suicide'
}

/**
 * Result from `debug_*` with `flatCallTracer`
 * A flat array of trace entries instead of a nested call tree
 */
export type FlatCallTraceResult = FlatTraceEntry[]
