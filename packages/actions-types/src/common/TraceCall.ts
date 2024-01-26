import type { Address } from './Address.js'
import type { Hex } from './Hex.js'
import type { TraceType } from './TraceType.js'

export type TraceCall = {
	type: TraceType
	from: Address
	to: Address
	gas?: bigint
	gasUsed?: bigint
	input: Hex
	output: Hex
	calls?: TraceCall[]
	value?: bigint
}
