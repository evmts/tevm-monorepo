import type { TraceType } from './TraceType.js'
import type { Address } from 'abitype'
import type { Hex } from 'viem'

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
