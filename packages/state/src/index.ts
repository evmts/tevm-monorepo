export type {
	TevmState,
	SerializableTevmState,
	ParameterizedTevmState,
	ParameterizedAccountStorage,
	ForkOptions,
	AccountStorage,
	StateCache,
	StateRoots,
	StateOptions,
	StateAction,
} from './state-types/index.js'
export type { BaseState } from './BaseState.js'
export { ContractCache } from './ContractCache.js'
export type { StateManager } from './StateManager.js'
export { createStateManager } from './createStateManager.js'
export { createBaseState } from './createBaseState.js'
export {
	commit,
	revert,
	deepCopy,
	getProof,
	checkpoint,
	getAccount,
	putAccount,
	clearCaches,
	dumpStorage,
	shallowCopy,
	getStateRoot,
	hasStateRoot,
	setStateRoot,
	deleteAccount,
	getForkClient,
	getAppliedKey,
	getContractCode,
	getForkBlockTag,
	putContractCode,
	dumpStorageRange,
	getContractStorage,
	putContractStorage,
	getAccountAddresses,
	modifyAccountFields,
	clearContractStorage,
	dumpCanonicalGenesis,
	getAccountFromProvider,
	generateCanonicalGenesis,
	originalStorageCache,
} from './actions/index.js'
export { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
