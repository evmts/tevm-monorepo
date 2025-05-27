import type { Chain } from '@tevm/blockchain'
import type { Common } from '@tevm/common'
import type { EvmType } from '@tevm/evm'
import type { StateManager } from '@tevm/state'

export type CreateVmOptions = {
	stateManager: StateManager
	evm: EvmType
	blockchain: Chain
	common: Common
}
