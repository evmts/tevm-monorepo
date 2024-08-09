import { createAddress } from '@tevm/address'
import { ForkError, InvalidBlockError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'
import { InternalRpcError } from 'viem'
import { getPendingClient } from '../internal/getPendingClient.js'

/**
 * @param {import('@tevm/blockchain').Chain} blockchain
 * @param {import('../common/BlockParam.js').BlockParam} blockParam
 * @returns {Promise<bigint >}
 */
const parseBlockParam = async (blockchain, blockParam) => {
	if (typeof blockParam === 'number') {
		return BigInt(blockParam)
	}
	if (typeof blockParam === 'bigint') {
		return blockParam
	}
	if (typeof blockParam === 'string' && blockParam.startsWith('0x')) {
		const block = await blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (blockParam)))
		return BigInt(block.header.number)
	}
	if (blockParam === 'safe') {
		const safeBlock = blockchain.blocksByTag.get('safe')
		// let's handle it here in case we forget to update it later
		if (safeBlock) {
			return safeBlock.header.number
		}
		throw new InvalidBlockError('safe not currently supported as block tag')
	}
	if (blockParam === 'latest' || blockParam === undefined) {
		const safeBlock = blockchain.blocksByTag.get('latest')
		// let's handle it here in case we forget to update it later
		if (safeBlock) {
			return safeBlock.header.number
		}
		throw new InvalidBlockError('latest block does not exist on chain')
	}
	if (blockParam === 'pending') {
		// for pending we need to mine a new block and then handle it
		// let's skip this functionality for now
		throw new InvalidBlockError(
			'Pending not yet supported but will be in future. Consider opening an issue or reaching out on telegram if you need this feature to expediate its release',
		)
	}
	if (blockParam === 'earliest') {
		return BigInt(1)
	}
	if (blockParam === 'finalized') {
		throw new InvalidBlockError('finalized noet yet supported for this feature')
	}
	blockchain.logger.error({ blockParam }, 'Unknown block param pased to blockNumberHandler')
	throw new InvalidBlockError(`Unknown block param ${blockParam} pased to blockNumberHandler`)
}

// TODO support EIP-234
/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthGetLogsHandler}
 */
export const ethGetLogsHandler = (client) => async (params) => {
	params.filterParams.topics
	params.filterParams.address

	client.logger.debug(params, 'blockNumberHandler called with params')
	const vm = await client.getVm()
	const receiptsManager = await client.getReceiptsManager()

	if (params.filterParams.toBlock === 'pending') {
		const mineResult = await getPendingClient(client)
		if (mineResult.errors) {
			throw mineResult.errors[0]
		}
		return ethGetLogsHandler(mineResult.pendingClient)({
			...params,
			filterParams: { ...params.filterParams, toBlock: 'latest' },
		})
	}

	// TODO make this more parallized
	const fromBlock = await vm.blockchain.getBlock(
		await parseBlockParam(vm.blockchain, params.filterParams.fromBlock ?? 0n),
	)
	const toBlock = await vm.blockchain.getBlock(
		await parseBlockParam(vm.blockchain, params.filterParams.toBlock ?? 'latest'),
	)
	const forkedBlock = vm.blockchain.blocksByTag.get('forked')

	/**
	 * @type {import('./EthResult.js').EthGetLogsResult}
	 */
	const logs = []

	const fetchFromRpc = forkedBlock && forkedBlock.header.number >= fromBlock.header.number

	if (fetchFromRpc) {
		// if the range includes prefork blocks (including fork since we don't have receipts for the fork block) then we need to fetch the logs from the forked chain
		if (!client.forkTransport) {
			throw new InternalRpcError(
				new Error(
					'InternalError: no forkUrl set on client despite a forkBlock. This should be an impossible state and indicates a bug in tevm',
				),
			)
		}
		const fetcher = createJsonRpcFetcher(client.forkTransport)
		const { result: jsonRpcLogs, error } = await fetcher.request({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_getLogs',
			params: [
				{
					fromBlock: numberToHex(fromBlock.header.number),
					toBlock:
						toBlock.header.number < forkedBlock.header.number
							? numberToHex(toBlock.header.number)
							: numberToHex(forkedBlock.header.number),
					address: params.filterParams.address,
					topics: params.filterParams.topics,
				},
			],
		})
		if (error) {
			throw new ForkError('Error fetching logs from forked chain', { cause: error })
		}
		if (!jsonRpcLogs) {
			throw new ForkError('Error fetching logs from forked chain no logs returned', {
				cause: new Error('Unexpected no logs'),
			})
		}
		/**
		 * @typedef {Object} Log
		 * @property {import('@tevm/utils').Hex} address
		 * @property {Array.<import('@tevm/utils').Hex>} topics
		 * @property {import('@tevm/utils').Hex} data
		 * @property {import('@tevm/utils').Hex} blockNumber
		 * @property {import('@tevm/utils').Hex} transactionHash
		 * @property {import('@tevm/utils').Hex} transactionIndex
		 * @property {import('@tevm/utils').Hex} blockHash
		 * @property {import('@tevm/utils').Hex} logIndex
		 * @property {boolean} removed
		 */

		const typedLogs =
			/**
			 * @type {Array<Log> | undefined}
			 */
			(jsonRpcLogs)

		if (typedLogs !== undefined) {
			logs.push(
				...typedLogs.map((log) => {
					return {
						removed: false,
						logIndex: hexToBigInt(log.logIndex),
						transactionIndex: hexToBigInt(log.transactionIndex),
						transactionHash: log.transactionHash,
						blockHash: log.blockHash,
						blockNumber: hexToBigInt(log.blockNumber),
						address: log.address,
						topics: log.topics,
						data: log.data,
					}
				}),
			)
		}
	}

	// if log filter doesn't go into tevm mined blocks then we don't need to check the cache
	if (forkedBlock && toBlock.header.number <= forkedBlock.header.number) {
		return logs
	}

	const cachedLogs = await receiptsManager.getLogs(
		fetchFromRpc ? fromBlock : /** @type {import('@tevm/block').Block}*/ (forkedBlock),
		toBlock,
		params.filterParams.address !== undefined ? [createAddress(params.filterParams.address).bytes] : [],
		params.filterParams.topics?.map((topic) => hexToBytes(topic)),
	)
	logs.push(
		...cachedLogs.map(({ log, block, tx, txIndex, logIndex }) => ({
			// what does this mean?
			removed: false,
			logIndex: BigInt(logIndex),
			transactionIndex: BigInt(txIndex),
			transactionHash: bytesToHex(tx.hash()),
			blockHash: bytesToHex(block.hash()),
			blockNumber: block.header.number,
			address: bytesToHex(log[0]),
			topics: log[1].map((topic) => bytesToHex(topic)),
			data: bytesToHex(log[2]),
		})),
	)
	return logs
}
