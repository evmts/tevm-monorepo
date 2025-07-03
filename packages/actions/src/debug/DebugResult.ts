import type { Block } from '@tevm/block'
import type { ChainOptions } from '@tevm/blockchain'
import type { ConsensusAlgorithm, ConsensusType } from '@tevm/common'
import type { ExecResult, PrecompileInput } from '@tevm/evm'
import type { Filter, TevmNode } from '@tevm/node'
import type { StateRoots, TevmState } from '@tevm/state'
import type { TxPool } from '@tevm/txpool'
import type { Address } from '@tevm/utils'
import type { CallTraceResult, FourbyteTraceResult, Hex, PrestateTraceResult, TraceResult } from '../common/index.js'
import type { GetPath } from '../utils/GetPath.js'
import type { UnionToIntersection } from '../utils/UnionToIntersection.js'
import type { DebugTraceStateFilter } from './DebugParams.js'

/**
 * Result from `debug_traceTransaction`
 */
export type DebugTraceTransactionResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TTracer extends 'callTracer'
	? CallTraceResult
	: TTracer extends 'prestateTracer'
		? PrestateTraceResult<TDiffMode>
		: TTracer extends '4byteTracer'
			? FourbyteTraceResult
			: TraceResult

/**
 * Result from `debug_traceCall`
 */
export type DebugTraceCallResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TTracer extends 'callTracer'
	? CallTraceResult
	: TTracer extends 'prestateTracer'
		? PrestateTraceResult<TDiffMode>
		: TTracer extends '4byteTracer'
			? FourbyteTraceResult
			: TraceResult

/**
 * Result from `debug_traceBlock`.
 *
 * Returns an array of transaction traces
 */
export type DebugTraceBlockResult<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
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
