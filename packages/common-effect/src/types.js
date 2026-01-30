/**
 * @module @tevm/common-effect/types
 * @description Type definitions for the common-effect package
 */

/**
 * Ethereum hardfork identifier
 * @typedef {'chainstart' | 'homestead' | 'dao' | 'tangerineWhistle' | 'spuriousDragon' | 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul' | 'muirGlacier' | 'berlin' | 'london' | 'arrowGlacier' | 'grayGlacier' | 'mergeForkIdTransition' | 'paris' | 'shanghai' | 'cancun' | 'prague' | 'osaka'} Hardfork
 */

/**
 * Logging level options
 * @typedef {'debug' | 'info' | 'warn' | 'error' | 'silent'} LogLevel
 */

/**
 * Common shape interface providing chain configuration
 * @typedef {Object} CommonShape
 * @property {import('@tevm/common').Common} common - The underlying Common object from @tevm/common
 * @property {number} chainId - The chain ID
 * @property {Hardfork} hardfork - The active hardfork
 * @property {readonly number[]} eips - Enabled EIPs
 * @property {() => import('@tevm/common').Common} copy - Create an independent copy of the Common object
 */

/**
 * Configuration options for CommonFromConfig layer
 * @typedef {Object} CommonConfigOptions
 * @property {number} [chainId] - Chain ID (default: 900 for tevm-devnet)
 * @property {Hardfork} [hardfork] - Hardfork to use (default: 'prague')
 * @property {readonly number[]} [eips] - Additional EIPs to enable
 * @property {LogLevel} [loggingLevel] - Logging level (default: 'warn')
 * @property {import('@tevm/common').CustomCrypto} [customCrypto] - Custom cryptographic implementations
 */

export {}
