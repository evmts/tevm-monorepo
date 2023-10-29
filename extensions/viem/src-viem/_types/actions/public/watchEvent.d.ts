import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type {
	MaybeAbiEventName,
	MaybeExtractEventArgsFromAbi,
} from '../../types/contract.js'
import type { Log } from '../../types/log.js'
import type { GetTransportConfig } from '../../types/transport.js'
import type { AbiEvent, Address } from 'abitype'
type PollOptions = {
	/**
	 * Whether or not the transaction hashes should be batched on each invocation.
	 * @default true
	 */
	batch?: boolean
	/**
	 * Polling frequency (in ms). Defaults to Client's pollingInterval config.
	 * @default client.pollingInterval
	 */
	pollingInterval?: number
}
export type WatchEventOnLogsParameter<
	TAbiEvent extends AbiEvent | undefined = undefined,
	TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	TEventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = Log<bigint, number, false, TAbiEvent, TStrict, TAbiEvents, TEventName>[]
export type WatchEventOnLogsFn<
	TAbiEvent extends AbiEvent | undefined = undefined,
	TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	_EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = (
	logs: WatchEventOnLogsParameter<TAbiEvent, TAbiEvents, TStrict, _EventName>,
) => void
export type WatchEventParameters<
	TAbiEvent extends AbiEvent | undefined = undefined,
	TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	_EventName extends string | undefined = MaybeAbiEventName<TAbiEvent>,
> = {
	/** The address of the contract. */
	address?: Address | Address[]
	/** The callback to call when an error occurred when trying to get for a new block. */
	onError?: (error: Error) => void
	/** The callback to call when new event logs are received. */
	onLogs: WatchEventOnLogsFn<TAbiEvent, TAbiEvents, TStrict, _EventName>
} & (GetTransportConfig<Transport>['type'] extends 'webSocket'
	?
			| {
					batch?: never
					/**
					 * Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`.
					 * @default false
					 */
					poll?: false
					pollingInterval?: never
			  }
			| (PollOptions & {
					/**
					 * Whether or not the WebSocket Transport should poll the JSON-RPC, rather than using `eth_subscribe`.
					 * @default true
					 */
					poll?: true
			  })
	: PollOptions & {
			poll?: true
	  }) &
	(
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
				events?: TAbiEvents
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
	)
export type WatchEventReturnType = () => void
/**
 * Watches and returns emitted [Event Logs](https://viem.sh/docs/glossary/terms.html#event-log).
 *
 * - Docs: https://viem.sh/docs/actions/public/watchEvent.html
 * - JSON-RPC Methods:
 *   - **RPC Provider supports `eth_newFilter`:**
 *     - Calls [`eth_newFilter`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_newfilter) to create a filter (called on initialize).
 *     - On a polling interval, it will call [`eth_getFilterChanges`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getfilterchanges).
 *   - **RPC Provider does not support `eth_newFilter`:**
 *     - Calls [`eth_getLogs`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getlogs) for each block between the polling interval.
 *
 * This Action will batch up all the Event Logs found within the [`pollingInterval`](https://viem.sh/docs/actions/public/watchEvent.html#pollinginterval-optional), and invoke them via [`onLogs`](https://viem.sh/docs/actions/public/watchEvent.html#onLogs).
 *
 * `watchEvent` will attempt to create an [Event Filter](https://viem.sh/docs/actions/public/createEventFilter.html) and listen to changes to the Filter per polling interval, however, if the RPC Provider does not support Filters (e.g. `eth_newFilter`), then `watchEvent` will fall back to using [`getLogs`](https://viem.sh/docs/actions/public/getLogs.html) instead.
 *
 * @param client - Client to use
 * @param parameters - {@link WatchEventParameters}
 * @returns A function that can be invoked to stop watching for new Event Logs. {@link WatchEventReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchEvent } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const unwatch = watchEvent(client, {
 *   onLogs: (logs) => console.log(logs),
 * })
 */
export declare function watchEvent<
	TChain extends Chain | undefined,
	const TAbiEvent extends AbiEvent | undefined = undefined,
	const TAbiEvents extends
		| readonly AbiEvent[]
		| readonly unknown[]
		| undefined = TAbiEvent extends AbiEvent ? [TAbiEvent] : undefined,
	TStrict extends boolean | undefined = undefined,
	_EventName extends string | undefined = undefined,
>(
	client: Client<Transport, TChain>,
	{
		address,
		args,
		batch,
		event,
		events,
		onError,
		onLogs,
		poll: poll_,
		pollingInterval,
		strict: strict_,
	}: WatchEventParameters<TAbiEvent, TAbiEvents, TStrict>,
): WatchEventReturnType
export {}
//# sourceMappingURL=watchEvent.d.ts.map
