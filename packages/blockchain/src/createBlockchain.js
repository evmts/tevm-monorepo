import { TevmBlock } from './TevmBlock.js'
import { TevmBlockchain } from './TevmBlockchain.js'
import { genesisStateRoot } from '@ethereumjs/trie'
import { createMemoryDb, numberToHex, parseGwei } from '@tevm/utils'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'

/**
 * @param {object} options
 * @param {import('@ethereumjs/common').Common} options.common
 * @param {string | undefined} options.forkUrl
 * @param {import('@tevm/utils').BlockTag | import('@tevm/utils').Hex | bigint} options.blockTag
 * @returns {Promise<TevmBlockchain>}
 */
export const createBlockchain = async ({ common, forkUrl, blockTag = 'latest' }) => {

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

	const out = await TevmBlockchain.create({
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

	if (forkUrl) {
		const fetcher = createJsonRpcFetcher(forkUrl)
		// TODO we shoudl validate this
		const jsonRpcBlock = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByNumber',
			params: [typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag, true],
		})
		const latestBlock = TevmBlock.fromRPC(/** @type {any}*/(jsonRpcBlock))
		out.putBlock(latestBlock)
	}

	return out
}
