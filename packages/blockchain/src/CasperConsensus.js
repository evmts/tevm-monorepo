import { ConsensusAlgorithm } from '@tevm/common'

/**
 * Minimal proof-of-stake consensus implementation used by Tevm's custom chain.
 */
export class CasperConsensus {
	constructor() {
		this.algorithm = ConsensusAlgorithm.Casper
	}

	/**
	 * @type {import('./Chain.js').Consensus['algorithm']}
	 */
	algorithm

	/**
	 * @returns {Promise<void>}
	 */
	async genesisInit() {}

	/**
	 * @returns {Promise<void>}
	 */
	async setup() {}

	/**
	 * @returns {Promise<void>}
	 */
	async validateConsensus() {}

	/**
	 * @param {import('@tevm/block').BlockHeader} header
	 * @returns {Promise<void>}
	 */
	async validateDifficulty(header) {
		if (header.difficulty !== 0n) {
			const message = 'invalid difficulty. PoS blocks must have difficulty 0'
			throw new Error(`${message} ${header.errorStr()}`)
		}
	}

	/**
	 * @returns {Promise<void>}
	 */
	async newBlock() {}
}
