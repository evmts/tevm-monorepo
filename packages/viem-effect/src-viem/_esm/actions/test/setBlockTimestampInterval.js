/**
 * Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime.html), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.
 *
 * - Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetBlockTimestampIntervalParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setBlockTimestampInterval } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setBlockTimestampInterval(client, { interval: 5 })
 */
export async function setBlockTimestampInterval(client, { interval }) {
	await client.request({
		method: `${client.mode}_setBlockTimestampInterval`,
		params: [interval],
	})
}
//# sourceMappingURL=setBlockTimestampInterval.js.map
