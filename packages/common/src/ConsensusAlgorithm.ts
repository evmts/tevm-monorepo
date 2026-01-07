/**
 * Consensus algorithms used by Ethereum networks.
 * @example
 * ```typescript
 * import { ConsensusAlgorithm } from '@tevm/common'
 *
 * const isCasper = consensusAlgorithm === ConsensusAlgorithm.Casper
 * ```
 */
export const ConsensusAlgorithm = {
	/**
	 * Ethash proof-of-work algorithm
	 * Used by pre-merge Ethereum mainnet
	 */
	Ethash: 'ethash',
	/**
	 * Clique proof-of-authority algorithm
	 * Used by networks like Goerli (deprecated)
	 */
	Clique: 'clique',
	/**
	 * Casper proof-of-stake algorithm
	 * Used by post-merge Ethereum mainnet
	 */
	Casper: 'casper',
} as const

/**
 * Type representing the possible consensus algorithms
 */
export type ConsensusAlgorithm = (typeof ConsensusAlgorithm)[keyof typeof ConsensusAlgorithm]
