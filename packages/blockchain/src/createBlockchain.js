import { CasperConsensus, CliqueConsensus, EthashConsensus } from '@ethereumjs/blockchain'
import { Block } from '@tevm/block'
import { ConsensusAlgorithm } from '@tevm/common'
import { genesisStateRoot } from '@tevm/trie'
import { AsyncEventEmitter, Lock, createMemoryDb, parseGwei } from '@tevm/utils'
import { DBManager } from './DbManager.js'

/**
 * @param {object} options
 * @param {import('@tevm/common').Common} options.common
 * @param {string} [options.forkUrl]
 * @param {import('@tevm/utils').BlockTag | import('@tevm/utils').Hex} [options.blockTag]
 * @returns {Promise<import('./TevmBlockchain.js').Blockchain>}
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
						withdrawals: /** @type {Array<import('@tevm/utils').WithdrawalData>}*/ ([]),
					}
				: {}),
		},
		{ common, setHardfork: false, skipConsensusFormatValidation: true },
	)
	const stateRoot = await genesisStateRoot(genesisState)
	const consensus = (() => {
		switch (common.consensusAlgorithm()) {
			case ConsensusAlgorithm.Casper:
				return new CasperConsensus()
			case ConsensusAlgorithm.Clique:
				return new CliqueConsensus()
			case ConsensusAlgorithm.Ethash:
				return new EthashConsensus()
			default:
				throw new Error(`consensus algorithm ${common.consensusAlgorithm()} not supported`)
		}
	})()

	const dbManager = new DBManager(db, common)

	const events = new AsyncEventEmitter()

	const lock = new Lock()

	const heads = {}

	/**
	 * Returns a deep copy of this {@link Blockchain} instance.
	 *
	 * Note: this does not make a copy of the underlying db
	 * since it is unknown if the source is on disk or in memory.
	 * This should not be a significant issue in most usage since
	 * the queries will only reflect the instance's known data.
	 * If you would like this copied blockchain to use another db
	 * set the {@link db} of this returned instance to a copy of
	 * the original.
	 */
	const shallowCopy = () => {
		const copiedBlockchain = Object.create(
			Object.getPrototypeOf(blockchain),
			Object.getOwnPropertyDescriptors(blockchain),
		)
		copiedBlockchain.common = common.copy()
		return copiedBlockchain
	}

	/**
	 * Run a function after acquiring a lock. It is implied that we have already
	 * initialized the module (or we are calling this from the init function, like
	 * `_setCanonicalGenesisBlock`)
	 * @param {any} action - function to run after acquiring a lock
	 * @hidden
	 */
	async function runWithLock(action) {
		try {
			await lock.acquire()
			const value = await action()
			return value
		} finally {
			lock.release()
		}
	}

	const blockchain = {
		consensus,
		db,
		dbManager,
		events,
		shallowCopy,
		runWithLock,
	}

	return blockchain
}
