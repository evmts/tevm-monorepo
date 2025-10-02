import { createEVM, EVM, getActivePrecompiles } from '@ethereumjs/evm'
import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'

/**
 * The Tevm EVM is in charge of executing bytecode. It is a very light wrapper around ethereumjs EVM
 * The Evm class provides tevm specific typing with regard to the custom stateManager. It does not
 * provide custom typing to the blockchain or common objects.
 * @type {typeof import('./EvmType.js').Evm}
 * @example
 * ```typescript
 * import { type Evm, createEvm, CreateEvmOptions } from 'tevm/evm'
 * import { mainnet } from 'tevm/common'
 * import { createStateManager } from 'tevm/state'
 * import { createBlockchain } from 'tevm/blockchain'}
 * import { EthjsAddress } from 'tevm/utils'
 *
 * const evm = createEvm({
 *   common: mainnet.copy(),
 *   stateManager: createStateManager(),
 *   blockchain: createBlockchain(),
 * })
 * ```
 * @see [createEvm](https://tevm.sh/reference/tevm/evm/functions/createevm/)
 */
export class Evm extends EVM {
	/**
	 * Adds a custom precompile to the EVM.
	 * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
	 * @throws {MisconfiguredClientError}
	 */
	addCustomPrecompile(precompile) {
		if (this._customPrecompiles === undefined) {
			throw new MisconfiguredClientError(
				'Custom precompiles is empty. This is an internal bug as it should always be defined',
			)
		}
		this._customPrecompiles.push(precompile)
		this._precompiles = getActivePrecompiles(this.common, this._customPrecompiles)
	}

	/**
	 * Removes a custom precompile from the EVM.
	 * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
	 * @throws {MisconfiguredClientError}
	 * @throws {InvalidParamsError}
	 */
	removeCustomPrecompile(precompile) {
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
		this._precompiles = getActivePrecompiles(this.common, this._customPrecompiles)
	}

	/**
	 * @type {(typeof import('./EvmType.js').Evm)['create']}
	 */
	static create = async (options) => {
		const evm = /** @type {any}*/ (await createEVM(options))
		evm.addCustomPrecompile = Evm.prototype.addCustomPrecompile.bind(evm)
		evm.removeCustomPrecompile = Evm.prototype.removeCustomPrecompile.bind(evm)
		return evm
	}
}
