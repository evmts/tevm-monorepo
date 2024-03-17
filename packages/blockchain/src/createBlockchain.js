import { TevmBlock } from './TevmBlock.js'
import { TevmBlockchain } from './TevmBlockchain.js'
import { genesisStateRoot } from '@ethereumjs/trie'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { createMemoryDb, numberToHex, parseGwei } from '@tevm/utils'

// TODO user should be able to pass in header information to json rpc requests anywhere createJsonRpcFetcher is used

const OP_DEPOSIT_TX_TYPE = '0x7e'

/**
 * @param {object} options
 * @param {import('@ethereumjs/common').Common} options.common
 * @param {string | undefined} options.forkUrl
 * @param {import('@tevm/utils').BlockTag | import('@tevm/utils').Hex | bigint} options.blockTag
 * @returns {Promise<TevmBlockchain>}
 */
export const createBlockchain = async ({
	common,
	forkUrl,
	blockTag = 'latest',
}) => {
	const db = createMemoryDb()
	/**
	 * @type {import('@ethereumjs/util').GenesisState}
	 */
	const genesisState = {}

	const genesisBlock = await (() => {
		if (forkUrl) {
			return createJsonRpcFetcher(forkUrl).request({
				jsonrpc: '2.0',
				id: 1,
				method: 'eth_getBlockByNumber',
				params: [
					'0x0',
					true
				],
			}).then(response => {
				return TevmBlock.fromRPC(/** @type {any}*/(response.result), undefined, {
					common,
					freeze: true,
					setHardfork: false,
					skipConsensusFormatValidation: true,
				})
			})
		}
		return TevmBlock.fromBlockData(
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
	})()
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
		// TODO we shoudl validate this
		const { result: jsonRpcBlock } = await createJsonRpcFetcher(forkUrl).request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getBlockByNumber',
			params: [
				typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag,
				true,
			],
		});
		console.log({ jsonRpcBlock })
		const latestBlock = TevmBlock.fromRPC({
			.../** @type {any}*/(jsonRpcBlock),
			// as a hack until optimism deposit tx type is supported filter out all those tx
			parentHash: genesisBlock.hash(),
			transactions: /** @type {any}*/(jsonRpcBlock).transactions.filter(
				/** @param {any} tx */
				tx => tx.type !== OP_DEPOSIT_TX_TYPE,
			)
		}, undefined, {
			common,
			freeze: true,
			setHardfork: false,
			skipConsensusFormatValidation: true,
		})
		console.log('putting block')
		await out.putBlock(latestBlock)
		console.log('successfully created blockchain with genesis block and state root')
	}


	return out
}
