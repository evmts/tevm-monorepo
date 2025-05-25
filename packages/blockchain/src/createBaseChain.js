import { createBlock } from '@tevm/block'
import { createLogger } from '@tevm/logger'
import { EMPTY_STATE_ROOT } from '@tevm/trie'
import { hexToBytes } from 'viem'
import { putBlock } from './actions/putBlock.js'
import { getBlockFromRpc } from './utils/getBlockFromRpc.js'

/**
 * Keccak-256 hash of the RLP of null
 */
const KECCAK256_RLP_S = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
/**
 * Keccak-256 hash of the RLP of null
 */
const KECCAK256_RLP = hexToBytes(KECCAK256_RLP_S)

/**
 * Creates a genesis {@link Block} for the blockchain with params from {@link Common.genesis}
 * @param {Uint8Array} stateRoot The genesis stateRoot
 * @param {import('@tevm/common').Common} common class
 * @returns {Block}
 */
const createGenesisBlock = (stateRoot, common) => {
	const newCommon = common.copy()
	newCommon.ethjsCommon.setHardforkBy({
		blockNumber: 0,
		timestamp: newCommon.ethjsCommon.genesis().timestamp ?? 0,
	})

	/**
	 * @type {import('@tevm/block').HeaderData}
	 */
	const header = {
		...newCommon.ethjsCommon.genesis(),
		number: 0,
		stateRoot,
		gasLimit: 30_000_000n,
		...(newCommon.ethjsCommon.isActivatedEIP(4895) ? { withdrawalsRoot: KECCAK256_RLP } : {}),
	}
	return createBlock({ header, ...(newCommon.ethjsCommon.isActivatedEIP(4895) ? { withdrawals: [] } : {}) }, { common })
}
/**
 * @param {import('./ChainOptions.js').ChainOptions} options
 * @returns {import('./BaseChain.js').BaseChain} Base chain object
 */
export const createBaseChain = (options) => {
	const logger = createLogger({
		name: '@tevm/blockchain',
		level: options.loggingLevel ?? 'warn',
	})
	/**
	 * @type {import('./BaseChain.js').BaseChain}
	 */
	const chain = {
		logger,
		options,
		common: options.common,
		blocks: new Map(),
		blocksByTag: new Map(),
		blocksByNumber: new Map(),
		ready: () => genesisBlockPromise.then(() => true),
	}

	// Add genesis block and forked block to chain
	const genesisBlockPromise = (async () => {
		if (options.fork?.transport) {
			const [block, jsonRpcBlock] = await getBlockFromRpc(chain, options.fork, options.common)
			await putBlock(chain)(block)
			chain.blocksByTag.set('forked', block)
			// because we are filtering transactions from optimism we must set the block to the optimism hash so parentBlock traversing works
			if (jsonRpcBlock.hash) {
				chain.blocks.set(jsonRpcBlock.hash, block)
			}
		} else {
			await putBlock(chain)(
				options.genesisBlock ?? createGenesisBlock(options.genesisStateRoot ?? EMPTY_STATE_ROOT, options.common),
			)
		}
	})()

	return chain
}
