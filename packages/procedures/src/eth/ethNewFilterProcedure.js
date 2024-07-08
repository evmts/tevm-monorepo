import { createAddress } from '@tevm/address'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { generateRandomId } from '../utils/generateRandomId.js'
import { parseBlockTag } from '../utils/parseBlockTag.js'

/**
 * Request handler for eth_newFilter JSON-RPC requests.
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthProcedure.js').EthNewFilterJsonRpcProcedure}
 */
export const ethNewFilterJsonRpcProcedure = (client) => {
	return async (request) => {
		const newFilterRequest = /** @type {import('./EthJsonRpcRequest.js').EthNewFilterJsonRpcRequest}*/ (request)

		const { topics, address, toBlock = 'latest', fromBlock = 'latest' } = newFilterRequest.params[0]
		const id = generateRandomId()
		const vm = await client.getVm()
		/**
		 * @param {typeof toBlock} tag
		 */
		const getBlock = async (tag) => {
			const parsedTag = parseBlockTag(tag)
			if (
				parsedTag === 'safe' ||
				parsedTag === 'latest' ||
				parsedTag === 'finalized' ||
				parsedTag === 'earliest' ||
				parsedTag === 'pending' ||
				parsedTag === /** @type any*/ ('forked')
			) {
				return vm.blockchain.blocksByTag.get(parsedTag)
			}
			if (typeof parsedTag === 'string') {
				return vm.blockchain.getBlock(hexToBytes(parsedTag))
			}
			return vm.blockchain.getBlock(parsedTag)
		}
		const _toBlock = await getBlock(toBlock)
		if (!_toBlock) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: `Invalid block tag ${toBlock}`,
				},
			}
		}
		const _fromBlock = await getBlock(fromBlock)
		if (!_fromBlock) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: `Invalid block tag ${fromBlock}`,
				},
			}
		}

		/**
		 * @param {import('@tevm/base-client').Filter['logs'][number]} log
		 */
		const listener = (log) => {
			const filter = client.getFilters().get(id)
			if (!filter) {
				return
			}
			filter.logs.push(log)
		}
		client.on('newLog', listener)
		// populate with past blocks
		const receiptsManager = await client.getReceiptsManager()
		const pastLogs = await receiptsManager.getLogs(
			_fromBlock,
			_toBlock,
			address !== undefined ? [createAddress(address).bytes] : [],
			topics?.map((topic) => hexToBytes(topic)),
		)
		client.setFilter({
			id,
			type: 'Log',
			created: Date.now(),
			logs: pastLogs.map((log) => {
				const [address, topics, data] = log.log
				return {
					topics: /** @type {[import('@tevm/utils').Hex, ...Array<import('@tevm/utils').Hex>]}*/ (
						topics.map((topic) => bytesToHex(topic))
					),
					address: bytesToHex(address),
					data: bytesToHex(data),
					blockNumber: log.block.header.number,
					transactionHash: bytesToHex(log.tx.hash()),
					removed: false,
					logIndex: log.logIndex,
					blockHash: bytesToHex(log.block.hash()),
					transactionIndex: log.txIndex,
				}
			}),
			tx: [],
			blocks: [],
			logsCriteria: {
				topics,
				address,
				toBlock: toBlock,
				fromBlock: fromBlock,
			},
			installed: {},
			err: undefined,
			registeredListeners: [listener],
		})
		return {
			...(request.id ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			result: id,
		}
	}
}
