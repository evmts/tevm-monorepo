import { createEVM, EVM, getActivePrecompiles } from '@evmts/zevm/evm'
import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'

/**
 * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
 */
const precompileAddress = (precompile) => precompile.address.toString().toLowerCase()

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
		const evm = /** @type {{ _customPrecompiles: import('./CustomPrecompile.js').CustomPrecompile[] | undefined }} */ (
			/** @type {unknown} */ (this)
		)
		if (evm._customPrecompiles === undefined) {
			throw new MisconfiguredClientError(
				'Custom precompiles is empty. This is an internal bug as it should always be defined',
			)
		}
		const address = precompileAddress(precompile)
		const index = evm._customPrecompiles.findIndex((item) => precompileAddress(item) === address)
		if (index === -1) {
			evm._customPrecompiles = [...evm._customPrecompiles, precompile]
		} else {
			evm._customPrecompiles = evm._customPrecompiles.map((item, i) => (i === index ? precompile : item))
		}
		this._precompiles = getActivePrecompiles(this.common, evm._customPrecompiles)
	}

	/**
	 * Removes a custom precompile from the EVM.
	 * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
	 * @throws {MisconfiguredClientError}
	 * @throws {InvalidParamsError}
	 */
	removeCustomPrecompile(precompile) {
		const evm = /** @type {{ _customPrecompiles: import('./CustomPrecompile.js').CustomPrecompile[] | undefined }} */ (
			/** @type {unknown} */ (this)
		)
		if (evm._customPrecompiles === undefined) {
			throw new MisconfiguredClientError(
				'Custom precompiles is empty. This is an internal bug as it should always be defined',
			)
		}
		const address = precompileAddress(precompile)
		const index = evm._customPrecompiles.findIndex((item) => precompileAddress(item) === address)
		if (index === -1) {
			throw new InvalidParamsError('Precompile not found')
		}
		evm._customPrecompiles = evm._customPrecompiles.filter((_, i) => i !== index)
		this._precompiles = getActivePrecompiles(this.common, evm._customPrecompiles)
	}

	/**
	 * @param {import('./EvmOpts.js').EVMOpts} [options]
	 * @returns {Promise<import('./EvmType.js').Evm>}
	 */
	static create = async (options) => {
		const evm = /** @type {any}*/ (
			await createEVM({
				...options,
				customPrecompiles: [...(options?.customPrecompiles ?? [])],
			})
		)
		evm.addCustomPrecompile = Evm.prototype.addCustomPrecompile.bind(evm)
		evm.removeCustomPrecompile = Evm.prototype.removeCustomPrecompile.bind(evm)
		return evm
	}
}
