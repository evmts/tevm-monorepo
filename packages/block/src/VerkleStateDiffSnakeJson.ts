import { type Hex } from '@tevm/utils'

export type VerkleStateDiffSnakeJson = {
	stem: Hex
	suffix_diffs: {
		current_value: Hex | null
		new_value: Hex | null
		suffix: number | string
	}[]
}
