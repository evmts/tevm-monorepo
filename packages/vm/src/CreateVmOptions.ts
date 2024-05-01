import type { Chain } from '@tevm/blockchain'
import type { Common } from '@tevm/common'
import type { Evm } from '@tevm/evm'
import type { StateManager } from '@tevm/state'

export type CreateVmOptions = {
	stateManager: StateManager
	evm: Evm
	blockchain: Chain
	common: Common
}
