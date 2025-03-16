/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { IntervalMining } from '[package-path]'
 * 
 * const value: IntervalMining = {
 *   // Initialize properties
 * }
 * ```
 */
export type IntervalMining = {
	type: 'interval'
	interval: number
}
/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { ManualMining } from '[package-path]'
 * 
 * const value: ManualMining = {
 *   // Initialize properties
 * }
 * ```
 */
export type ManualMining = {
	type: 'manual'
}
/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { AutoMining } from '[package-path]'
 * 
 * const value: AutoMining = {
 *   // Initialize properties
 * }
 * ```
 */
export type AutoMining = {
	type: 'auto'
}
/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { GasMining } from '[package-path]'
 * 
 * const value: GasMining = {
 *   // Initialize properties
 * }
 * ```
 */
export type GasMining = {
	type: 'gas'
	limit: BigInt
}
/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { MiningConfig } from '[package-path]'
 * 
 * const value: MiningConfig = {
 *   // Initialize properties
 * }
 * ```
 */
export type MiningConfig = IntervalMining | ManualMining | AutoMining | GasMining
