import { bytesToHex } from 'viem'
import { validateHeader } from './validateHeader.js'

/**
 * @param {import('@tevm/block').Block} block
 * @returns {`0x${string}` | undefined}
 */
const getJsonRpcBlockHash = (block) => {
	const hash = /** @type {{ __tevmJsonRpcBlockHash?: unknown }} */ (block).__tevmJsonRpcBlockHash
	return typeof hash === 'string' ? /** @type {`0x${string}`} */ (hash) : undefined
}

/**
 * @param {import('@tevm/block').Block} block
 * @param {string} hash
 */
const blockHasHash = (block, hash) => bytesToHex(block.hash()) === hash || getJsonRpcBlockHash(block) === hash

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['putBlock']}
 */
export const putBlock = (baseChain) => async (block) => {
	if (block.common.ethjsCommon.chainId() !== baseChain.common.ethjsCommon.chainId()) {
		throw new Error('Block does not match the chainId of common')
	}
	const blockHash = bytesToHex(block.hash())
	const jsonRpcBlockHash = getJsonRpcBlockHash(block)
	const parentHash = bytesToHex(block.header.parentHash)
	const latestBlock = baseChain.blocksByTag.get('latest')
	const isBootstrapBlock = latestBlock === undefined
	const parentBlock = baseChain.blocks.get(parentHash)
	if (!isBootstrapBlock && parentBlock !== undefined && jsonRpcBlockHash === undefined) {
		await validateHeader(baseChain)(block.header)
	}
	baseChain.blocks.set(blockHash, block)
	if (jsonRpcBlockHash !== undefined) {
		baseChain.blocks.set(jsonRpcBlockHash, block)
	}
	baseChain.logger.debug(block.hash(), 'Saved new block')
	const extendsLatest = latestBlock === undefined || blockHasHash(latestBlock, parentHash)
	const replacesGenesisBootstrap = latestBlock?.header.isGenesis() && block.header.number > latestBlock.header.number
	if (!baseChain.blocksByNumber.has(block.header.number)) {
		baseChain.blocksByNumber.set(block.header.number, block)
	}
	if (
		isBootstrapBlock ||
		replacesGenesisBootstrap ||
		(extendsLatest && latestBlock.header.number < block.header.number)
	) {
		baseChain.logger.debug(block.header.toJSON().number, 'New highest block height. Setting block at latest')
		baseChain.blocksByTag.set('latest', block)
	}
}
