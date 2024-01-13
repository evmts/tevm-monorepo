import type { TraceCall } from './TraceCall.js'
import type { TraceType } from './TraceType.js'
import type { Address } from 'abitype'
import type { Hex } from 'viem'

export type TraceResult = {
	type: TraceType
	from: Address
	to: Address
	value: bigint
	gas: bigint
	gasUsed: bigint
	input: Hex
	output: Hex
	calls?: TraceCall[]
}
