import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { BlockNumber, BlockTag } from '../../types/block.js'
import type { Chain } from '../../types/chain.js'
import type {
	MaybeAbiEventName,
	MaybeExtractEventArgsFromAbi,
} from '../../types/contract.js'
import type { Log } from '../../types/log.js'
import type { Hash } from '../../types/misc.js'
import type { AbiEvent, Address } from 'abitype'
export type GetLogsParameters<
	TAbiEvent extends AbiEvent | undefined = undefined,
	TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	_EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = {
	/** Address or list of addresses from which logs originated */
	address?: Address | Address[]
} & (
	| {
			event: TAbiEvent
			events?: never
			args?: MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName>
			/**
			 * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
			 * @default false
			 */
			strict?: TStrict
	  }
	| {
			event?: never
			events: TAbiEvents
			args?: never
			/**
			 * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
			 * @default false
			 */
			strict?: TStrict
	  }
	| {
			event?: never
			events?: never
			args?: never
			strict?: never
	  }
) &
	(
		| {
				/** Block number or tag after which to include logs */
				fromBlock?: TFromBlock | BlockNumber | BlockTag
				/** Block number or tag before which to include logs */
				toBlock?: TToBlock | BlockNumber | BlockTag
				blockHash?: never
		  }
		| {
				fromBlock?: never
				toBlock?: never
				/** Hash of block to include logs from */
				blockHash?: Hash
		  }
	)
export type GetLogsReturnType<
	TAbiEvent extends AbiEvent | undefined = undefined,
	TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
	_EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
	_Pending extends boolean =
		| (TFromBlock extends 'pending' ? true : false)
		| (TToBlock extends 'pending' ? true : false),
> = Log<bigint, number, _Pending, TAbiEvent, TStrict, TAbiEvents, _EventName>[]
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
export declare function getLogs<
	TChain extends Chain | undefined,
	const TAbiEvent extends AbiEvent | undefined = undefined,
	const TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	TFromBlock extends BlockNumber | BlockTag | undefined = undefined,
	TToBlock extends BlockNumber | BlockTag | undefined = undefined,
>(
	client: Client<Transport, TChain>,
	{
		address,
		blockHash,
		fromBlock,
		toBlock,
		event,
		events: events_,
		args,
		strict: strict_,
	}?: GetLogsParameters<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock>,
): Promise<
	GetLogsReturnType<TAbiEvent, TAbiEvents, TStrict, TFromBlock, TToBlock>
>
//# sourceMappingURL=getLogs.d.ts.map
