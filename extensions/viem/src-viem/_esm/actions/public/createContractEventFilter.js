import { encodeEventTopics } from '../../utils/abi/encodeEventTopics.js'
import { numberToHex } from '../../utils/encoding/toHex.js'
import { createFilterRequestScope } from '../../utils/filters/createFilterRequestScope.js'
/**
 * Creates a Filter to retrieve event logs that can be used with [`getFilterChanges`](https://viem.sh/docs/actions/public/getFilterChanges.html) or [`getFilterLogs`](https://viem.sh/docs/actions/public/getFilterLogs.html).
 *
 * - Docs: https://viem.sh/docs/contract/createContractEventFilter.html
 *
 * @param client - Client to use
 * @param parameters - {@link CreateContractEventFilterParameters}
 * @returns [`Filter`](https://viem.sh/docs/glossary/types.html#filter). {@link CreateContractEventFilterReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createContractEventFilter } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createContractEventFilter(client, {
 *   abi: parseAbi(['event Transfer(address indexed, address indexed, uint256)']),
 * })
 */
export async function createContractEventFilter(
	client,
	{ address, abi, args, eventName, fromBlock, strict, toBlock },
) {
	const getRequest = createFilterRequestScope(client, {
		method: 'eth_newFilter',
	})
	const topics = eventName
		? encodeEventTopics({
				abi,
				args,
				eventName,
		  })
		: undefined
	const id = await client.request({
		method: 'eth_newFilter',
		params: [
			{
				address,
				fromBlock:
					typeof fromBlock === 'bigint' ? numberToHex(fromBlock) : fromBlock,
				toBlock: typeof toBlock === 'bigint' ? numberToHex(toBlock) : toBlock,
				topics,
			},
		],
	})
	return {
		abi,
		args,
		eventName,
		id,
		request: getRequest(id),
		strict,
		type: 'event',
	}
}
//# sourceMappingURL=createContractEventFilter.js.map
