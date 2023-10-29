import { formatBlock } from '../../utils/formatters/block.js'
import { observe } from '../../utils/observe.js'
import { poll } from '../../utils/poll.js'
import { stringify } from '../../utils/stringify.js'
import { getBlock } from './getBlock.js'
/**
 * Watches and returns information for incoming blocks.
 *
 * - Docs: https://viem.sh/docs/actions/public/watchBlocks.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/blocks/watching-blocks
 * - JSON-RPC Methods:
 *   - When `poll: true`, calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getBlockByNumber) on a polling interval.
 *   - When `poll: false` & WebSocket Transport, uses a WebSocket subscription via [`eth_subscribe`](https://docs.alchemy.com/reference/eth-subscribe-polygon) and the `"newHeads"` event.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchBlocksParameters}
 * @returns A function that can be invoked to stop watching for new block numbers. {@link WatchBlocksReturnType}
 *
 * @example
 * import { createPublicClient, watchBlocks, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchBlocks(client, {
 *   onBlock: (block) => console.log(block),
 * })
 */
export function watchBlocks(
	client,
	{
		blockTag = 'latest',
		emitMissed = false,
		emitOnBegin = false,
		onBlock,
		onError,
		includeTransactions: includeTransactions_,
		poll: poll_,
		pollingInterval = client.pollingInterval,
	},
) {
	const enablePolling =
		typeof poll_ !== 'undefined' ? poll_ : client.transport.type !== 'webSocket'
	const includeTransactions = includeTransactions_ ?? false
	let prevBlock
	const pollBlocks = () => {
		const observerId = stringify([
			'watchBlocks',
			client.uid,
			emitMissed,
			emitOnBegin,
			includeTransactions,
			pollingInterval,
		])
		return observe(observerId, { onBlock, onError }, (emit) =>
			poll(
				async () => {
					try {
						const block = await getBlock(client, {
							blockTag,
							includeTransactions,
						})
						if (block.number && prevBlock?.number) {
							// If the current block number is the same as the previous,
							// we can skip.
							if (block.number === prevBlock.number) return
							// If we have missed out on some previous blocks, and the
							// `emitMissed` flag is truthy, let's emit those blocks.
							if (block.number - prevBlock.number > 1 && emitMissed) {
								for (let i = prevBlock?.number + 1n; i < block.number; i++) {
									const block = await getBlock(client, {
										blockNumber: i,
										includeTransactions,
									})
									emit.onBlock(block, prevBlock)
									prevBlock = block
								}
							}
						}
						if (
							// If no previous block exists, emit.
							!prevBlock?.number ||
							// If the block tag is "pending" with no block number, emit.
							(blockTag === 'pending' && !block?.number) ||
							// If the next block number is greater than the previous block number, emit.
							// We don't want to emit blocks in the past.
							(block.number && block.number > prevBlock.number)
						) {
							emit.onBlock(block, prevBlock)
							prevBlock = block
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
	const subscribeBlocks = () => {
		const active = true
		let unsubscribe = () => active === false
		;(async () => {
			try {
				const { unsubscribe: unsubscribe_ } = await client.transport.subscribe({
					params: ['newHeads'],
					onData(data) {
						if (!active) return
						const format =
							client.chain?.formatters?.block?.format || formatBlock
						const block = format(data.result)
						onBlock(block, prevBlock)
						prevBlock = block
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
	return enablePolling ? pollBlocks() : subscribeBlocks()
}
//# sourceMappingURL=watchBlocks.js.map
