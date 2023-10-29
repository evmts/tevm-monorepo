import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { BlockNumber, BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type { Filter } from '../../types/filter.js'
import type { Log } from '../../types/log.js'
import type { Abi, AbiEvent, ExtractAbiEvent } from 'abitype'
export type GetFilterLogsParameters<
	TAbi extends Abi | readonly unknown[] | undefined = undefined,
	TEventName extends string | undefined = undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
> = {
	filter: Filter<'event', TAbi, TEventName, any, TStrict, TFromBlock, TToBlock>
}
export type GetFilterLogsReturnType<
	TAbi extends Abi | readonly unknown[] | undefined = undefined,
	TEventName extends string | undefined = undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	_AbiEvent extends AbiEvent | undefined = TAbi extends Abi
		? TEventName extends string
			? ExtractAbiEvent<TAbi, TEventName>
			: undefined
		: undefined,
	_Pending extends boolean =
		| (TFromBlock extends 'pending' ? true : false)
		| (TToBlock extends 'pending' ? true : false),
> = Log<bigint, number, _Pending, _AbiEvent, TStrict, TAbi, TEventName>[]
/**
 * Returns a list of event logs since the filter was created.
 *
 * - Docs: https://viem.sh/docs/actions/public/getFilterLogs.html
 * - JSON-RPC Methods: [`eth_getFilterLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterlogs)
 *
 * `getFilterLogs` is only compatible with **event filters**.
 *
 * @param client - Client to use
 * @param parameters - {@link GetFilterLogsParameters}
 * @returns A list of event logs. {@link GetFilterLogsReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbiItem } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEventFilter, getFilterLogs } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const filter = await createEventFilter(client, {
 *   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
 *   event: parseAbiItem('event Transfer(address indexed, address indexed, uint256)'),
 * })
 * const logs = await getFilterLogs(client, { filter })
 */
export declare function getFilterLogs<
	TChain extends Chain | undefined,
	const TAbi extends Abi | readonly unknown[] | undefined,
	TEventName extends string | undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
>(
	_client: Client<Transport, TChain>,
	{
		filter,
	}: GetFilterLogsParameters<TAbi, TEventName, TStrict, TFromBlock, TToBlock>,
): Promise<
	GetFilterLogsReturnType<TAbi, TEventName, TStrict, TFromBlock, TToBlock>
>
//# sourceMappingURL=getFilterLogs.d.ts.map
