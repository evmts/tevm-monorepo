import type { ParameterizedAccountStorage } from './ParameterizedAccountStorage.js'

// API friendly version of TevmState with bigints and uint8arrays replaced with hex strings
/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { ParameterizedTevmState } from '[package-path]'
 * 
 * const value: ParameterizedTevmState = {
 *   // Initialize properties
 * }
 * ```
 */
export type ParameterizedTevmState = {
	[key: string]: ParameterizedAccountStorage
}
