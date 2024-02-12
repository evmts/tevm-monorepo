import type { EVMStateManagerInterface } from '@ethereumjs/common'
import type { Address } from 'viem'

export interface TevmStateManagerInterface extends EVMStateManagerInterface {
	getAccountAddresses: () => Address[]
}
