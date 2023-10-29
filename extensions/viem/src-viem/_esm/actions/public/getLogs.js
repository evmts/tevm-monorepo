import {
	DecodeLogDataMismatch,
	DecodeLogTopicsMismatch,
} from '../../errors/abi.js'
import { decodeEventLog } from '../../utils/abi/decodeEventLog.js'
import { encodeEventTopics } from '../../utils/abi/encodeEventTopics.js'
import { numberToHex } from '../../utils/encoding/toHex.js'
import { formatLog } from '../../utils/formatters/log.js'
/**
 * Returns a list of event logs matching the provided parameters.
 *
 * - Docs: https://viem.sh/docs/actions/public/getLogs.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/filters-and-logs/event-logs
 * - JSON-RPC Methods: [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs)
 *
 * @param client - Client to use
 * @param parameters - {@link GetLogsParameters}
 * @returns A list of event logs. {@link GetLogsReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbiItem } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getLogs } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const logs = await getLogs(client)
 */
export async function getLogs(
	client,
	{
		address,
		blockHash,
		fromBlock,
		toBlock,
		event,
		events: events_,
		args,
		strict: strict_,
	} = {},
) {
	const strict = strict_ ?? false
	const events = events_ ?? (event ? [event] : undefined)
	let topics = []
	if (events) {
		topics = [
			events.flatMap((event) =>
				encodeEventTopics({
					abi: [event],
					eventName: event.name,
					args,
				}),
			),
		]
		if (event) topics = topics[0]
	}
	let logs
	if (blockHash) {
		logs = await client.request({
			method: 'eth_getLogs',
			params: [{ address, topics, blockHash }],
		})
	} else {
		logs = await client.request({
			method: 'eth_getLogs',
			params: [
				{
					address,
					topics,
					fromBlock:
						typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
					toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
				},
			],
		})
	}
	return logs
		.map((log) => {
			try {
				const { eventName, args } = events
					? decodeEventLog({
							abi: events,
							data: log.data,
							topics: log.topics,
							strict,
					  })
					: { eventName: undefined, args: undefined }
				return formatLog(log, { args, eventName: eventName })
			} catch (err) {
				let eventName
				let isUnnamed
				if (
					err instanceof DecodeLogDataMismatch ||
					err instanceof DecodeLogTopicsMismatch
				) {
					// If strict mode is on, and log data/topics do not match event definition, skip.
					if (strict) return
					eventName = err.abiItem.name
					isUnnamed = err.abiItem.inputs?.some((x) => !('name' in x && x.name))
				}
				// Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
				return formatLog(log, { args: isUnnamed ? [] : {}, eventName })
			}
		})
		.filter(Boolean)
}
//# sourceMappingURL=getLogs.js.map
