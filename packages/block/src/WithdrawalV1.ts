import type { Hex } from '@tevm/utils'

export type WithdrawalV1 = {
	index: Hex // Quantity, 8 Bytes
	validatorIndex: Hex // Quantity, 8 bytes
	address: Hex // DATA, 20 bytes
	amount: Hex // Quantity, 32 bytes
}
