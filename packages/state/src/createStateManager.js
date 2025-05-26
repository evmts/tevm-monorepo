import {
	checkpoint,
	clearCaches,
	clearContractStorage,
	commit,
	deepCopy,
	deleteAccount,
	dumpCanonicalGenesis,
	dumpStorage,
	dumpStorageRange,
	generateCanonicalGenesis,
	getAccount,
	getAccountAddresses,
	getAppliedKey,
	getContractCode,
	getContractStorage,
	getProof,
	getStateRoot,
	hasStateRoot,
	modifyAccountFields,
	putAccount,
	putContractCode,
	putContractStorage,
	revert,
	setStateRoot,
	shallowCopy,
} from './actions/index.js'
import { originalStorageCache } from './actions/originalStorageCache.js'
import { saveStateRoot } from './actions/saveStateRoot.js'
import { createBaseState } from './createBaseState.js'

/**
 * @param {import('./state-types/StateOptions.js').StateOptions} options
 * @returns {import('./StateManager.js').StateManager}
 */
export const createStateManager = (options) => {
	return decorate(createBaseState(options))
}

/**
 * @param {import('./BaseState.js').BaseState} state
 * @returns {import('./StateManager.js').StateManager}
 */
const decorate = (state) => {
	/**
	 * @type {import('./StateManager.js').StateManager}
	 */
	const wrappedState = {
		ready: state.ready,
		_baseState: state,
		deepCopy: async () => {
			return decorate(await deepCopy(state)())
		},
		shallowCopy: () => {
			return decorate(shallowCopy(state)())
		},
		dumpCanonicalGenesis: () => dumpCanonicalGenesis(state)(),
		generateCanonicalGenesis: generateCanonicalGenesis(state),
		putAccount: putAccount(state),
		clearCaches: clearCaches(state),
		commit: commit(state),
		checkpoint: checkpoint(state),
		revert: revert(state),
		getProof: getProof(state),
		getCode: getContractCode(state),
		getCodeSize: (address) => getContractCode(state)(address).then((code) => code.length),
		getAccount: getAccount(state),
		dumpStorage: dumpStorage(state),
		getStateRoot: getStateRoot(state),
		hasStateRoot: hasStateRoot(state),
		setStateRoot: setStateRoot(state),
		saveStateRoot: saveStateRoot(state),
		deleteAccount: deleteAccount(state),
		putCode: putContractCode(state),
		dumpStorageRange: dumpStorageRange(state),
		getStorage: getContractStorage(state),
		putStorage: putContractStorage(state),
		clearStorage: clearContractStorage(state),
		modifyAccountFields: modifyAccountFields(state),
		clearContractStorage: clearContractStorage(state),
		getAccountAddresses: getAccountAddresses(state),
		// Unused provided to fulfill interface
		getAppliedKey: /** @type {any}*/ (getAppliedKey(state)),
		originalStorageCache: originalStorageCache(state),
	}
	return wrappedState
}
