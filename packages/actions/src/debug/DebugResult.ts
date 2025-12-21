import type { Block } from '@tevm/block'
import type { ChainOptions } from '@tevm/blockchain'
import type { ConsensusAlgorithm, ConsensusType } from '@tevm/common'
import type { ExecResult, PrecompileInput } from '@tevm/evm'
import type { Filter, TevmNode } from '@tevm/node'
import type { StateRoots, TevmState } from '@tevm/state'
import type { TxPool } from '@tevm/txpool'
import type { Address } from '@tevm/utils'
import type {
	CallTraceResult,
	FlatCallTraceResult,
	FourbyteTraceResult,
	Hex,
	MuxTraceResult,
	PrestateTraceResult,
	TraceResult,
} from '../common/index.js'
import type { GetPath } from '../utils/GetPath.js'
import type { UnionToIntersection } from '../utils/UnionToIntersection.js'
import type { DebugTraceStateFilter } from './DebugParams.js'

/**
 * Result from `debug_traceTransaction`
 */
export type DebugTraceTransactionResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TTracer extends 'callTracer'
	? CallTraceResult
	: TTracer extends 'prestateTracer'
		? PrestateTraceResult<TDiffMode>
		: TTracer extends '4byteTracer'
			? FourbyteTraceResult
			: TTracer extends 'flatCallTracer'
				? FlatCallTraceResult
				: TTracer extends 'muxTracer'
					? MuxTraceResult
					: TraceResult

/**
 * Result from `debug_traceCall`
 */
export type DebugTraceCallResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TTracer extends 'callTracer'
	? CallTraceResult
	: TTracer extends 'prestateTracer'
		? PrestateTraceResult<TDiffMode>
		: TTracer extends '4byteTracer'
			? FourbyteTraceResult
			: TTracer extends 'flatCallTracer'
				? FlatCallTraceResult
				: TTracer extends 'muxTracer'
					? MuxTraceResult
					: TraceResult

/**
 * Result from `debug_traceBlock`.
 *
 * Returns an array of transaction traces
 */
export type DebugTraceBlockResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = Array<{
	/**
	 * Transaction hash
	 */
	txHash: Hex
	/**
	 * Transaction index in the block
	 */
	txIndex: number
	/**
	 * Trace result for this transaction
	 */
	result: DebugTraceTransactionResult<TTracer, TDiffMode>
}>

/**
 * Complete state object structure
 */
// TODO: make this serializable
export type DebugTraceStateObject = {
	readonly blockchain: {
		readonly blocksByNumber: Map<bigint, Block | undefined>
		readonly initOptions: ChainOptions
	}
	readonly evm: {
		readonly opcodes: Map<
			number,
			{
				readonly code: number
				readonly name: string
				readonly fullName: string
				readonly fee: number
				readonly feeBigInt: bigint
				readonly isAsync: boolean
				readonly dynamicGas: boolean
				readonly isInvalid: boolean
			}
		>
		readonly precompiles: Map<string, (input: PrecompileInput) => Promise<ExecResult> | ExecResult>
		readonly common: {
			readonly eips: number[]
			readonly hardfork: string
			readonly consensus: {
				readonly algorithm: string | ConsensusAlgorithm
				readonly type: string | ConsensusType
			}
		}
	}
	readonly node: {
		readonly status: TevmNode['status']
		readonly mode: TevmNode['mode']
		readonly miningConfig: TevmNode['miningConfig']
		readonly filters: Map<Hex, Filter>
		readonly impersonatedAccount: Address | undefined
	}
	readonly pool: {
		readonly pool: TxPool['pool']
		readonly txsByHash: TxPool['txsByHash']
		readonly txsByNonce: TxPool['txsByNonce']
		readonly txsInNonceOrder: TxPool['txsInNonceOrder']
		readonly txsInPool: TxPool['txsInPool']
	}
	readonly stateManager: {
		readonly storage: TevmState
		readonly stateRoots: StateRoots
	}
}

/**
 * Result from `debug_traceState`
 */
export type DebugTraceStateResult<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = TStateFilters['length'] extends 0
	? DebugTraceStateObject
	: UnionToIntersection<
			{
				[I in keyof TStateFilters]: GetPath<DebugTraceStateObject, TStateFilters[I] & string>
			}[keyof TStateFilters]
		>

/**
 * Account state in debug_dumpBlock result
 */
export type DebugDumpBlockAccountState = {
	/**
	 * Account balance in hex
	 */
	balance: Hex
	/**
	 * Account nonce in hex
	 */
	nonce: Hex
	/**
	 * Account code hash
	 */
	codeHash: Hex
	/**
	 * Account storage root
	 */
	root: Hex
	/**
	 * Contract code (if present)
	 */
	code?: Hex
	/**
	 * Account storage
	 */
	storage?: Record<Hex, Hex>
}

/**
 * Result from `debug_dumpBlock`
 */
export type DebugDumpBlockResult = {
	/**
	 * State root hash
	 */
	root: Hex
	/**
	 * Accounts in the state
	 */
	accounts: Record<Hex, DebugDumpBlockAccountState>
}

/**
 * Result from `debug_getModifiedAccountsByNumber`
 */
export type DebugGetModifiedAccountsByNumberResult = Hex[]

/**
 * Result from `debug_getModifiedAccountsByHash`
 */
export type DebugGetModifiedAccountsByHashResult = Hex[]

/**
 * Storage entry in debug_storageRangeAt result
 */
export type DebugStorageEntry = {
	/**
	 * Storage key
	 */
	key: Hex
	/**
	 * Storage value
	 */
	value: Hex
}

/**
 * Result from `debug_storageRangeAt`
 */
export type DebugStorageRangeAtResult = {
	/**
	 * Storage entries
	 */
	storage: Record<Hex, DebugStorageEntry>
	/**
	 * Next storage key for pagination (null if no more entries)
	 */
	nextKey: Hex | null
}

/**
 * Result from `debug_intermediateRoots`
 *
 * Returns an array of state roots, one for each transaction in the block
 */
export type DebugIntermediateRootsResult = Array<Hex>

/**
 * Result from `debug_preimage`
 *
 * Returns the preimage (original data) for a hash, or null if not available
 */
export type DebugPreimageResult = Hex | null

/**
 * Result from `debug_traceChain`
 *
 * Returns traces for all transactions in the specified block range
 */
export type DebugTraceChainResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = Array<{
	/**
	 * Block number
	 */
	blockNumber: number
	/**
	 * Block hash
	 */
	blockHash: Hex
	/**
	 * Traces for all transactions in this block
	 */
	txTraces: Array<{
		/**
		 * Transaction hash
		 */
		txHash: Hex
		/**
		 * Transaction index in the block
		 */
		txIndex: number
		/**
		 * Trace result for this transaction
		 */
		result: DebugTraceTransactionResult<TTracer, TDiffMode>
	}>
}>

/**
 * Result from `debug_getRawBlock`
 *
 * Returns the RLP-encoded block as a hex string
 */
export type DebugGetRawBlockResult = Hex

/**
 * Result from `debug_getRawHeader`
 *
 * Returns the RLP-encoded block header as a hex string
 */
export type DebugGetRawHeaderResult = Hex

/**
 * Result from `debug_getRawTransaction`
 *
 * Returns the raw transaction bytes as a hex string
 */
export type DebugGetRawTransactionResult = Hex

/**
 * Result from `debug_getRawReceipts`
 *
 * Returns an array of consensus-encoded (RLP) receipts as hex strings
 */
export type DebugGetRawReceiptsResult = Hex[]
