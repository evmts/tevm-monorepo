import { hexToBigInt } from '../../utils/encoding/fromHex.js'
import { observe } from '../../utils/observe.js'
import { poll } from '../../utils/poll.js'
import { stringify } from '../../utils/stringify.js'
import { getBlockNumber } from './getBlockNumber.js'
/**
 * Watches and returns incoming block numbers.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchBlockNumber.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/blocks/watching-blocks
 * - JSON-RPC Methods:
 *   - When `poll: true`, calls [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchBlockNumberParameters}
 * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlockNumberReturnType}
 *
 * @example
 * import { createPublicClient, watchBlockNumber, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchBlockNumber(client, {
 *   onBlockNumber: (blockNumber) => console.log(blockNumber),
 * })
 */
export function watchBlockNumber(
	client,
	{
		emitOnBegin = false,
		emitMissed = false,
		onBlockNumber,
		onError,
		poll: poll_,
		pollingInterval = client.pollingInterval,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	let prevBlockNumber
	const pollBlockNumber = () => {
		const observerId = stringify([
			'watchBlockNumber',
			client.uid,
			emitOnBegin,
			emitMissed,
			pollingInterval,
		])
		return observe(observerId, { onBlockNumber, onError }, (emit) =>
			poll(
				async () => {
					try {
						const blockNumber = await getBlockNumber(client, { cacheTime: 0 })
						if (prevBlockNumber) {
							// If the current block number is the same as the previous,
							// we can skip.
							if (blockNumber === prevBlockNumber) return
							// If we have missed out on some previous blocks, and the
							// `emitMissed` flag is truthy, let's emit those blocks.
							if (blockNumber - prevBlockNumber > 1 && emitMissed) {
								for (let i = prevBlockNumber + 1n; i < blockNumber; i++) {
									emit.onBlockNumber(i, prevBlockNumber)
									prevBlockNumber = i
								}
							}
						}
						// If the next block number is greater than the previous,
						// it is not in the past, and we can emit the new block number.
						if (!prevBlockNumber || blockNumber > prevBlockNumber) {
							emit.onBlockNumber(blockNumber, prevBlockNumber)
							prevBlockNumber = blockNumber
						}
					} catch (err) {
						emit.onError?.(err)
					}
				},
				{
					emitOnBegin,
					interval: pollingInterval,
				},
			),
		)
	}
	const subscribeBlockNumber = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['newHeads'],
					onData(data) {
						if (!active) return
						const blockNumber = hexToBigInt(data.result?.number)
						onBlockNumber(blockNumber, prevBlockNumber)
						prevBlockNumber = blockNumber
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
	return enablePolling ? pollBlockNumber() : subscribeBlockNumber()
}
//# sourceMappingURL=watchBlockNumber.js.map
