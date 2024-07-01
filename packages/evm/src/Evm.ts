import { EVM, getActivePrecompiles } from '@ethereumjs/evm'
import type { StateManager } from '@tevm/state'
import type { CustomPrecompile } from './CustomPrecompile.js'
import type { EVMOpts } from './EvmOpts.js'
import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'

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
	public addCustomPrecompile(precompile: CustomPrecompile) {
		if (this._customPrecompiles === undefined) {
			throw new MisconfiguredClientError(
				'Custom precompiles is empty. This is an internal bug as it should always be defined',
			)
		}
		this._customPrecompiles.push(precompile)
		const mutableThis = this as unknown as { _precompiles: ReturnType<typeof getActivePrecompiles> }
		mutableThis._precompiles = getActivePrecompiles(this.common, this._customPrecompiles)
	}
	public removeCustomPrecompile(precompile: CustomPrecompile) {
		if (this._customPrecompiles === undefined) {
			throw new MisconfiguredClientError(
				'Custom precompiles is empty. This is an internal bug as it should always be defined',
			)
		}
		const index = this._customPrecompiles.indexOf(precompile)
		if (index === -1) {
			throw new InvalidParamsError('Precompile not found')
		}
		this._customPrecompiles.splice(index, 1)
		const mutableThis = this as unknown as { _precompiles: ReturnType<typeof getActivePrecompiles> }
		mutableThis._precompiles = getActivePrecompiles(this.common, this._customPrecompiles)
	}
	public declare static create: (options?: EVMOpts) => Promise<Evm>
	public declare stateManager: StateManager
	protected declare _customPrecompiles: CustomPrecompile[]
}
