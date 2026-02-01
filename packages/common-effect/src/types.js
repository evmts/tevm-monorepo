/**
 * @module @tevm/common-effect/types
 * @description Type definitions for the common-effect package
 */

/**
 * @typedef {import('./CommonShape.js').Hardfork} Hardfork
 */

/**
 * @typedef {import('./CommonShape.js').CommonShape} CommonShape
 */

/**
 * Logging level options
 * @typedef {'debug' | 'info' | 'warn' | 'error' | 'silent'} LogLevel
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
