import { createAddress } from '@tevm/address'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { generateRandomId } from './utils/generateRandomId.js'
import { parseBlockTag } from './utils/parseBlockTag.js'

/**
 * @typedef {UnknownBlockError | InvalidBlockError} EthNewFilterError
 */

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthNewFilterHandler}
 */
export const ethNewFilterHandler = (client) => async (params) => {
	const { topics, address, toBlock = 'latest', fromBlock } = params
	const vm = await client.getVm()
	const filter = {
		fromBlock: params.fromBlock ? await parseBlockParam(vm.blockchain, params.fromBlock) : undefined,
		toBlock: params.toBlock ? await parseBlockParam(vm.blockchain, params.toBlock) : undefined,
		addresses: (() => {
			if (Array.isArray(params.address)) {
				return params.address.map((addr) => createAddress(addr).bytes)
			}
			if (params.address) {
				return [createAddress(params.address).bytes]
			}
			return undefined
		})(),
		topics: params.topics?.map((topic) => {
			if (Array.isArray(topic)) {
				return topic
					.map((t) => t === null ? null : hexToBytes(/** @type {`0x${string}`} */(t)))
					.filter((t) => t !== null)
			}
			return topic === null ? null : hexToBytes(/** @type {`0x${string}`} */(topic))
		}),
	}

	const id = generateRandomId()
	/**
	 * @param {any} log
	 * @returns {void}
	 */
	const listener = (log) => {
		const filter = client.getFilters().get(id)
		if (!filter) {
			return
		}
		filter.logs.push(log)
	}
	client.on('newLog', listener)
	const receiptsManager = await client.getReceiptsManager()
	const pastLogs = await receiptsManager.getLogs(
		filter.fromBlock,
		filter.toBlock,
		filter.addresses,
		filter.topics,
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
			fromBlock: fromBlock ?? filter.fromBlock,
		},
		installed: {},
		err: undefined,
		registeredListeners: [listener],
	})
	return id
}
