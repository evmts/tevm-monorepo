import { createAddress } from '@tevm/address'
import { InvalidBlockError, UnknownBlockError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from '@tevm/utils'
import { isArray } from '../utils/isArray.js'
import { generateRandomId } from './utils/generateRandomId.js'
import { parseBlockTag } from './utils/parseBlockTag.js'

/**
 * @typedef {UnknownBlockError | InvalidBlockError} EthNewFilterError
 */

/**
 * @param {import('@tevm/node').TevmNode} tevmNode
 * @returns {import('./EthHandler.js').EthNewFilterHandler} ethNewFilterHandler
 */
export const ethNewFilterHandler = (tevmNode) => {
	return async (params) => {
		const { topics, address, toBlock = 'latest', fromBlock } = params
		const vm = await tevmNode.getVm()
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
			if (typeof tag === 'bigint') {
				return vm.blockchain.getBlock(tag)
			}
			throw new InvalidBlockError(`Invalid block tag ${tag}`)
		}
		const _toBlock = await getBlock(toBlock)
		if (!_toBlock) {
			throw new UnknownBlockError(`Unknown block tag ${toBlock}`)
		}
		const _fromBlock = await getBlock(fromBlock ?? 'latest')
		if (!_fromBlock) {
			throw new UnknownBlockError(`Unknown block tag ${fromBlock}`)
		}

		const id = generateRandomId()
		/**
		 * @param {import('@tevm/node').Filter['logs'][number]} log
		 */
		const listener = (log) => {
			const filter = tevmNode.getFilters().get(id)
			if (!filter) {
				return
			}
			filter.logs.push(log)
		}
		tevmNode.on('newLog', listener)
		// populate with past blocks
		const receiptsManager = await tevmNode.getReceiptsManager()
		const pastLogs = await receiptsManager.getLogs(
			_fromBlock,
			_toBlock,
			address !== undefined ? [createAddress(address).bytes] : [],
			topics?.map((topic) => (isArray(topic) ? topic.map(hexToBytes) : hexToBytes(topic))),
		)
		tevmNode.setFilter({
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
					logIndex: BigInt(log.logIndex),
					blockHash: bytesToHex(log.block.hash()),
					transactionIndex: BigInt(log.txIndex),
				}
			}),
			tx: [],
			blocks: [],
			logsCriteria: {
				topics,
				address,
				toBlock: toBlock,
				fromBlock: fromBlock ?? _fromBlock.header.number,
			},
			installed: {},
			err: undefined,
			registeredListeners: [listener],
		})
		return id
	}
}
