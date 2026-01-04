/**
 * Consensus types for Ethereum networks.
 * @example
 * ```typescript
 * import { ConsensusType } from '@tevm/common'
 *
 * const isPoS = consensusType === ConsensusType.ProofOfStake
 * ```
 */
export const ConsensusType = {
	/**
	 * Proof of Stake consensus mechanism
	 * Used by Ethereum mainnet since The Merge
	 */
	ProofOfStake: 'pos',
	/**
	 * Proof of Work consensus mechanism
	 * Used by pre-merge Ethereum and other networks
	 */
	ProofOfWork: 'pow',
	/**
	 * Proof of Authority consensus mechanism
	 * Used by private/permissioned networks
	 */
	ProofOfAuthority: 'poa',
} as const

/**
 * Type representing the possible consensus types
 */
export type ConsensusType = (typeof ConsensusType)[keyof typeof ConsensusType]
