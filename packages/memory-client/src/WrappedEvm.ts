import { EVM } from '@ethereumjs/evm'
import type {
	ForkStateManager,
	NormalStateManager,
	ProxyStateManager,
} from '@tevm/state'

/**
 * A wrapper around the EVM to expose some protected functionality of the EVMStateManger
 * Ideally we find a way to remove this complexity and replace with a normal `action`
 * @internal
 */
export class WrappedEvm extends EVM {
	public declare stateManager:
		| NormalStateManager
		| ForkStateManager
		| ProxyStateManager
}
