import { TevmBlock } from './TevmBlock.js'
import { TevmBlockchain } from './TevmBlockchain.js'
import { genesisStateRoot } from '@ethereumjs/trie'
import { createMemoryDb, parseGwei } from '@tevm/utils'

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

	const genesisBlock = TevmBlock.fromBlockData(
		{
			header: {
				...common.genesis(),
				baseFeePerGas: parseGwei('1'),
				coinbase: '0xc014ba5ec014ba5ec014ba5ec014ba5ec014ba5e',
			},
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
