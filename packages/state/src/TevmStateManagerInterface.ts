import type { EVMStateManagerInterface } from '@ethereumjs/common'

export interface TevmStateManagerInterface extends EVMStateManagerInterface {
	getAccountAddresses: () => string[]
}
