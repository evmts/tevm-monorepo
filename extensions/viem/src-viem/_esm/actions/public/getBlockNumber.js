import { getCache, withCache } from '../../utils/promise/withCache.js'
const cacheKey = (id) => `blockNumber.${id}`
export function getBlockNumberCache(id) {
	return getCache(cacheKey(id))
}
/**
 * Returns the number of the most recent block seen.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlockNumber.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/blocks/fetching-blocks
 * - JSON-RPC Methods: [`eth_blockNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_blocknumber)
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockNumberParameters}
 * @returns The number of the block. {@link GetBlockNumberReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlockNumber } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const blockNumber = await getBlockNumber(client)
 * // 69420n
 */
export async function getBlockNumber(
	client,
	{ cacheTime = client.cacheTime, maxAge } = {},
) {
	const blockNumberHex = await withCache(
		() =>
			client.request({
				method: 'eth_blockNumber',
			}),
		{ cacheKey: cacheKey(client.uid), cacheTime: maxAge ?? cacheTime },
	)
	return BigInt(blockNumberHex)
}
//# sourceMappingURL=getBlockNumber.js.map
