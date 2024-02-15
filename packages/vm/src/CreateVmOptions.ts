import { type TevmBlockchain } from '@tevm/blockchain'
import { type TevmCommon } from '@tevm/common'
import { type Evm } from '@tevm/evm'
import { type TevmStateManager } from '@tevm/state'

export type CreateVmOptions = {
	stateManager: TevmStateManager
	evm: Evm
	blockchain: TevmBlockchain
	common: TevmCommon
}
