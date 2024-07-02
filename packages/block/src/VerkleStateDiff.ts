// this file is originally adapted from ethereumjs and thus carries the same license
import type { Hex } from '@tevm/utils'

export interface VerkleStateDiff {
	stem: Hex
	suffixDiffs: {
		currentValue: Hex | null
		newValue: Hex | null
		suffix: number | string
	}[]
}
