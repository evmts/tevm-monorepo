import type { Chain } from '@tevm/blockchain'
import type { Common } from '@tevm/common'
import type { EvmType } from '@tevm/evm'
import type { StateManager } from '@tevm/state'
import type { AsyncEventEmitter } from '@tevm/utils'
import type { VMEvents } from './utils/index.js'

export type BaseVm = {
	common: Common
	stateManager: StateManager
	blockchain: Chain
	evm: EvmType
	events: AsyncEventEmitter<VMEvents>
	/**
	 * This is copied from ethereumjs and we want to match the interface
	 * Cached emit() function, not for public usage
	 * set to public due to implementation internals
	 * @hidden
	 */
	_emit: (topic: keyof VMEvents, data: any) => Promise<void>
	ready: () => Promise<true>
}
