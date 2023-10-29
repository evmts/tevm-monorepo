import {
	DecodeLogDataMismatch,
	DecodeLogTopicsMismatch,
} from '../../errors/abi.js'
import { InvalidInputRpcError } from '../../errors/rpc.js'
import { decodeEventLog } from '../../utils/abi/decodeEventLog.js'
import { encodeEventTopics } from '../../utils/abi/encodeEventTopics.js'
import { getAbiItem } from '../../utils/abi/getAbiItem.js'
import { formatLog } from '../../utils/formatters/log.js'
import { observe } from '../../utils/observe.js'
import { poll } from '../../utils/poll.js'
import { stringify } from '../../utils/stringify.js'
import { createContractEventFilter } from './createContractEventFilter.js'
import { getBlockNumber } from './getBlockNumber.js'
import { getFilterChanges } from './getFilterChanges.js'
import { getLogs } from './getLogs.js'
import { uninstallFilter } from './uninstallFilter.js'
/**
 * Watches and returns emitted contract event logs.
 *
 * - Docs: https://viem.sh/docs/contract/watchContractEvent.html
 *
 * This Action will batch up all the event logs found within the [`pollingInterval`](https://viem.sh/docs/contract/watchContractEvent.html#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/contract/watchContractEvent.html#onLogs).
 *
 * `watchContractEvent` will attempt to create an [Event Filter](https://viem.sh/docs/contract/createContractEventFilter.html) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchContractEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchContractEventParameters}
 * @returns A function that can be invoked to stop watching for new event logs. {@link WatchContractEventReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchContractEvent } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchContractEvent(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)']),
 *   eventName: 'Transfer',
 *   args: { from: '0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b' },
 *   onLogs: (logs) => console.log(logs),
 * })
 */
export function watchContractEvent(
	client,
	{
		abi,
		address,
		args,
		batch = true,
		eventName,
		onError,
		onLogs,
		poll: poll_,
		pollingInterval = client.pollingInterval,
		strict: strict_,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	const pollContractEvent = () => {
		const observerId = stringify([
			'watchContractEvent',
			address,
			args,
			batch,
			client.uid,
			eventName,
			pollingInterval,
		])
		const strict = strict_ ?? false
		return observe(observerId, { onLogs, onError }, (emit) => {
			let previousBlockNumber
			let filter
			let initialized = false
			const unwatch = poll(
				async () => {
					if (!initialized) {
						try {
							filter = await createContractEventFilter(client, {
								abi,
								address,
								args,
								eventName,
								strict,
							})
						} catch {}
						initialized = true
						return
					}
					try {
						let logs
						if (filter) {
							logs = await getFilterChanges(client, { filter })
						} else {
							// If the filter doesn't exist, we will fall back to use `getLogs`.
							// The fall back exists because some RPC Providers do not support filters.
							// Fetch the block number to use for `getLogs`.
							const blockNumber = await getBlockNumber(client)
							// If the block number has changed, we will need to fetch the logs.
							// If the block number doesn't exist, we are yet to reach the first poll interval,
							// so do not emit any logs.
							if (previousBlockNumber && previousBlockNumber !== blockNumber) {
								logs = await getLogs(client, {
									address,
									args,
									fromBlock: previousBlockNumber + 1n,
									toBlock: blockNumber,
									event: getAbiItem({
										abi,
										name: eventName,
									}),
								})
							} else {
								logs = []
							}
							previousBlockNumber = blockNumber
						}
						if (logs.length === 0) return
						if (batch) emit.onLogs(logs)
						else logs.forEach((log) => emit.onLogs([log]))
					} catch (err) {
						// If a filter has been set and gets uninstalled, providers will throw an InvalidInput error.
						// Reinitalize the filter when this occurs
						if (filter && err instanceof InvalidInputRpcError)
							initialized = false
						emit.onError?.(err)
					}
				},
				{
					emitOnBegin: true,
					interval: pollingInterval,
				},
			)
			return async () => {
				if (filter) await uninstallFilter(client, { filter })
				unwatch()
			}
		})
	}
	const subscribeContractEvent = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const topics = eventName
					? encodeEventTopics({
							abi: abi,
							eventName: eventName,
							args,
					  })
					: []
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['logs', { address, topics }],
					onData(data) {
						if (!active) return
						const log = data.result
						try {
							const { eventName, args } = decodeEventLog({
								abi: abi,
								data: log.data,
								topics: log.topics,
								strict: strict_,
							})
							const formatted = formatLog(log, {
								args,
								eventName: eventName,
							})
							onLogs([formatted])
						} catch (err) {
							let eventName
							let isUnnamed
							if (
								err instanceof DecodeLogDataMismatch ||
								err instanceof DecodeLogTopicsMismatch
							) {
								// If strict mode is on, and log data/topics do not match event definition, skip.
								if (strict_) return
								eventName = err.abiItem.name
								isUnnamed = err.abiItem.inputs?.some(
									(x) => !('name' in x && x.name),
								)
							}
							// Set args to empty if there is an error decoding (e.g. indexed/non-indexed params mismatch).
							const formatted = formatLog(log, {
								args: isUnnamed ? [] : {},
								eventName,
							})
							onLogs([formatted])
						}
					},
					onError(error) {
						onError?.(error)
					},
				})
				unsubscribe = unsubscribe_
				if (!active) unsubscribe()
			} catch (err) {
				onError?.(err)
			}
		})()
		return unsubscribe
	}
	return enablePolling ? pollContractEvent() : subscribeContractEvent()
}
//# sourceMappingURL=watchContractEvent.js.map
