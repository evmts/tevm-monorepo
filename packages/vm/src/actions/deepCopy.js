import { MisconfiguredClientError } from '@tevm/errors'
import { createEvm } from '@tevm/evm'
import { createBaseVm } from '../createBaseVm.js'

// TODO CreateEvmError
// TODO CreateBaseVmError
/**
 * @typedef {MisconfiguredClientError} DeepCopyError
 */

/**
 * @typedef {() => Promise<import('../BaseVm.js').BaseVm>} DeepCopy
 */

/**
 * @param {import('../BaseVm.js').BaseVm} baseVm
 * @returns {DeepCopy}
 * @throws {DeepCopyError}
 */
export const deepCopy = (baseVm) => async () => {
	await baseVm.ready()
	const common = baseVm.common.copy()
	common.vmConfig.setHardfork(baseVm.common.vmConfig.hardfork())
	const blockchain = await baseVm.blockchain.deepCopy()
	if (!('deepCopy' in baseVm.stateManager)) {
		throw new MisconfiguredClientError('StateManager does not support deepCopy. Was a Tevm state manager used?')
	}
	const stateManager = await baseVm.stateManager.deepCopy()
	const evmCopy = await createEvm({
		blockchain,
		common,
		stateManager,
		allowUnlimitedContractSize: baseVm.evm.allowUnlimitedContractSize ?? false,
		customPrecompiles: /** @type {any} */ (baseVm.evm)._customPrecompiles,
		// customPredeploys isn't needed because it will be copied along in stateManager.deepCopy
		// customPredeploys,
		profiler: Boolean(/** @type {any} */ (baseVm.evm).optsCached?.profiler?.enabled) ?? false,
	})
	// we are hacking ethereumjs logger into working with our logger
	const evmAny = /** @type {any}*/ (evmCopy)
	evmAny.DEBUG = baseVm.evm.DEBUG
	evmAny._debug = /** @type any*/ (baseVm.evm)._debug
	return createBaseVm({
		stateManager,
		blockchain: baseVm.blockchain,
		activatePrecompiles: true,
		common,
		evm: evmCopy,
	})
}
