// Native types - migrated from @ethereumjs/common
export type { AccountFields } from './AccountFields.js'
export type { CliqueConfig } from './CliqueConfig.js'
export { ConsensusAlgorithm } from './ConsensusAlgorithm.js'
export type { ConsensusAlgorithm as ConsensusAlgorithmType } from './ConsensusAlgorithm.js'
export { ConsensusType } from './ConsensusType.js'
export type { ConsensusType as ConsensusTypeType } from './ConsensusType.js'
// Native CustomCrypto interface - now the primary export
export type {
	CustomCrypto,
	KZG,
	VerkleCrypto,
} from './CustomCrypto.js'
export type {
	EvmStateManagerInterface,
	AccountInterface,
	AddressInterface,
} from './EvmStateManagerInterface.js'
export type { StorageDump } from './StorageDump.js'
export type { StorageRange } from './StorageRange.js'
export type { Common } from './Common.js'
export type { CommonOptions } from './CommonOptions.js'
export { createCommon } from './createCommon.js'
export { createMockKzg } from './createMockKzg.js'
export type { Hardfork } from './Hardfork.js'
export type { MockKzg } from './MockKzg.js'
export * from './presets/index.js'
