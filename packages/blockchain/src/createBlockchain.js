import { Block } from '@tevm/block'
import { genesisStateRoot } from '@tevm/trie'
import { createMemoryDb, parseGwei } from '@tevm/utils'
import { TevmBlockchain } from './TevmBlockchain.js'

/**
 * @param {object} options
 * @param {import('@tevm/common').Common} options.common
 * @returns {Promise<TevmBlockchain>}
 */
export const createBlockchain = async ({ common }) => {
	const db = createMemoryDb()
	/**
	 * @type {import('@tevm/utils').GenesisState}
	 */
	const genesisState = {}

	const genesisBlock = Block.fromBlockData(
		{
			header: {
				...common.genesis(),
				baseFeePerGas: parseGwei('1'),
				coinbase: '0xc014ba5ec014ba5ec014ba5ec014ba5ec014ba5e',
			},
			...(common.isActivatedEIP(4895)
				? {
						withdrawals:
							/** @type {Array<import('@tevm/utils').WithdrawalData>}*/ ([]),
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
