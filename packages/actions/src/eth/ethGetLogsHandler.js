import { createAddress } from '@tevm/address'
import { InternalRpcError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'
import { getPendingClient } from '../internal/getPendingClient.js'
import { isArray } from '../utils/isArray.js'
import { parseBlockParam } from './utils/parseBlockParam.js'

// TODO support EIP-234
/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthGetLogsHandler}
 */
export const ethGetLogsHandler = (client) => async (params) => {
	client.logger.debug(params, 'ethGetLogsHandler called with params')
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
			throw error
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
			(jsonRpcLogs ?? undefined)

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
		fetchFromRpc ? /** @type {import('@tevm/block').Block}*/ (forkedBlock) : fromBlock,
		toBlock,
		params.filterParams.address !== undefined ? [createAddress(params.filterParams.address).bytes] : [],
		// params.filterParams.topics?.map((topic) => hexToBytes(topic)),

		params.filterParams.topics?.map((topic) => {
			if (topic === null) return null
			return isArray(topic) ? topic.map(hexToBytes) : hexToBytes(topic)
		}),
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
