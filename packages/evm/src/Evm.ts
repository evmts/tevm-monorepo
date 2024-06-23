import { EVM } from '@ethereumjs/evm'
import type { StateManager } from '@tevm/state'
import type { EVMOpts } from './EvmOpts.js'

/**
 * The Tevm EVM is in charge of executing bytecode. It is a very light wrapper around ethereumjs EVM
 * The Evm class provides tevm specific typing with regard to the custom stateManager. It does not
 * provide custom typing to the blockchain or common objects.
 * @example
 * ```typescript
 * import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
 * import { mainnet } from 'tevm/common'
 * import { createStateManager } from 'tevm/state'
 * import { createBlockchain } from 'tevm/blockchain'}
 * import { EthjsAddress } from 'tevm/utils'
 *
 * const evm: Evm = createEvm({
 *   common: mainnet.copy(),
 *   stateManager: createStateManager(),
 *   blockchain: createBlockchain(),
 * })
 * ```
 * @see [createEvm](https://tevm.sh/reference/tevm/evm/functions/createevm/)
 */
export class Evm extends EVM {
	public declare static create: (options?: EVMOpts) => Promise<Evm>
	public declare stateManager: StateManager
}
