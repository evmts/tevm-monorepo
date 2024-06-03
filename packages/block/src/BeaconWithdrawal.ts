import { type Hex } from '@tevm/utils'

export type BeaconWithdrawal = {
	index: Hex
	validator_index: Hex
	address: Hex
	amount: Hex
}
