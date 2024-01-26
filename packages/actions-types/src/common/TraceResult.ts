import type { Address } from './Address.js'
import type { Hex } from './Hex.js'
import type { TraceCall } from './TraceCall.js'
import type { TraceType } from './TraceType.js'

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
