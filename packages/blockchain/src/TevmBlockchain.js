import { txType } from './txType.js'
import { Block } from '@ethereumjs/block'
// TODO This is a class but ideally would be a factory function (or multiple factory functions) returning an interface
import { Blockchain } from '@ethereumjs/blockchain'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { hexToNumber, numberToHex } from 'viem'

/**
 * A wrapper around {@link import('@ethereumjs/blockchain').Blockchain}
 * TevmBlockchain notably implements a createFromForkUrl method that properly
 * forks a live blockchain.
 */
export class TevmBlockchain extends Blockchain {
	/**
	 * Creates a TevmBlockchain instance
	 * @override
	 * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options]
	 * @returns {Promise<TevmBlockchain>}
	 */
	static create = async (options) => {
		const blockchain = new TevmBlockchain(options)
		/**
		 * @warning we are ignoring this is a private method!!!!
		 */
		await /** @type any*/ (blockchain)._init(options)
		return blockchain
	}
	/**
	 * Forks a a given block from rpc url and creates a blockchain
	 * @param {object} options - A required options object
	 * @param {string} options.url - The url being forked
	 * @param {import('viem').BlockTag | bigint | import('viem').Hex} [options.tag] - An optional blockTag to fork
	 * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options.blockchainOptions] - Options to pass to the underlying {@link import('@ethereumjs/blockchain').Blockchain} constructor
	 */
	static createFromForkUrl = async ({ url, tag, blockchainOptions }) => {
		/**
		 * @type {import('@tevm/jsonrpc').JsonRpcResponse<'eth_getBlockByHash'|'eth_getBlockByNumber', import('@ethereumjs/block').JsonRpcBlock, any>}
		 */
		let blockResponse

		if (typeof tag === 'string' && tag.startsWith('0x') && tag.length === 66) {
			blockResponse = /** @type any*/ (
				await createJsonRpcFetcher(url).request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBlockByHash',
					params: [tag, true],
				})
			)
		} else if (typeof tag === 'bigint') {
			blockResponse = /** @type any*/ (
				await createJsonRpcFetcher(url).request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBlockByNumber',
					params: [numberToHex(tag), true],
				})
			)
		} else if (
			[
				undefined,
				'latest',
				'earliest',
				'pending',
				'safe',
				'finalized',
			].includes(tag)
		) {
			blockResponse = /** @type any*/ (
				await createJsonRpcFetcher(url).request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getBlockByNumber',
					params: [tag ?? 'latest', true],
				})
			)
		} else {
			throw new Error(`Invalid block tag provided: ${tag}`)
		}

		if (blockResponse.error) {
			throw blockResponse.error
		}
		if (!blockResponse.result) {
			throw new Error(
				'Malformed JSON-RPC response: No data nor errors returned in JSON-RPC request to forkUrl',
			)
		}

		const uncleHeaders = await Promise.all(
			/** @type {Array<unknown>}*/ (blockResponse.result.uncles).map((_, i) => {
				// TODO make this do a bulk request instead
				return createJsonRpcFetcher(url).request({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getUncleByBlockHashAndIndex',
					params: [
						/**@type {import('@ethereumjs/block').JsonRpcBlock}*/ (
							blockResponse.result
						).hash,
						numberToHex(i),
					],
				})
			}),
		)

		const chain = await TevmBlockchain.create(blockchainOptions)

		// filter out unsupported transactions
		const supportedTransactions = blockResponse.result.transactions.filter(
			(tx) =>
				typeof tx === 'string' ||
				Object.values(txType).includes(
					hexToNumber(/**@type {import('viem').Hex}*/ (tx.type)),
				),
		)

		await chain.putBlock(
			Block.fromRPC(
				{ ...blockResponse.result, transactions: supportedTransactions },
				uncleHeaders,
				blockchainOptions?.common
					? { common: blockchainOptions.common }
					: undefined,
			),
		)

		return chain
	}

	/**
	 * @type {import('@ethereumjs/block').Block | undefined}
	 */
	#pendingBlock = undefined

	/**
	 * @returns {Promise<import('@ethereumjs/block').Block | undefined>}
	 */
	getPendingBlock = async () => {
		return this.#pendingBlock
	}

	/**
	 * @param {import('@ethereumjs/block').Block | undefined} block
	 * @returns {Promise<void>}
	 */
	setPendingBlock = async (block) => {
		this.#pendingBlock = block
	}

	/**
	 * @param {object} options
	 * @param {import('viem').BlockTag | bigint} options.tag
	 */
	getBlockByOption = async ({ tag }) => {
		switch (tag) {
			case undefined:
			case 'pending':
				return this.getPendingBlock()
			case 'earliest':
				return this.getBlock(0n)
			case 'latest':
				return this.getCanonicalHeadBlock()
			case 'safe':
				return this.getIteratorHeadSafe()
			case 'finalized':
				throw new Error('Tevm does not support finalized block tag')
			default: {
				const latest = await this.getCanonicalHeadBlock()
				if (tag > latest.header.number) {
					/**
					 * @type {import('@tevm/errors').InvalidBlockError}
					 */
					const err = {
						_tag: 'InvalidBlockError',
						name: 'InvalidBlockError',
						message: 'specified block greater than current height',
					}
					throw err
				}
				if (tag === latest.header.number) {
					return latest
				}
				return this.getBlock(tag)
			}
		}
	}
}
