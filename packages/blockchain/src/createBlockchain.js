import { Block } from './Block.js'
import { TevmBlockchain } from './TevmBlockchain.js'
import { genesisStateRoot } from '@ethereumjs/trie'
import { createMemoryDb } from '@tevm/utils'

/**
 * @param {object} options
 * @param {import('@ethereumjs/common').Common} options.common
 * @returns {Promise<TevmBlockchain>}
 */
export const createBlockchain = async ({ common }) => {
	const db = createMemoryDb()
	/**
	 * @type {import('@ethereumjs/util').GenesisState}
	 */
	const genesisState = {}

	const genesisBlock = Block.fromBlockData(
		{
			header: common.genesis(),
			...(common.isActivatedEIP(4895)
				? {
						withdrawals:
							/** @type {Array<import('@ethereumjs/util').WithdrawalData>}*/ ([]),
				  }
				: {}),
		},
		{ common, setHardfork: false, skipConsensusFormatValidation: true },
	)
	const stateRoot = await genesisStateRoot(genesisState)

	return TevmBlockchain.create({
		genesisState,
		hardforkByHeadBlockNumber: false,
		db,
		common,
		validateBlocks: false,
		validateConsensus: false,
		genesisBlock,
		genesisStateRoot: stateRoot,
		// using ethereumjs defaults for this and disabling it
		// consensus,
	})
}
