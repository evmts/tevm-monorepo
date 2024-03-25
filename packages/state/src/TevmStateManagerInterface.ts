import type { EvmStateManagerInterface } from '@tevm/common'
import type { Address } from 'viem'

export interface TevmStateManagerInterface extends EvmStateManagerInterface {
	getAccountAddresses: () => Address[]
}
