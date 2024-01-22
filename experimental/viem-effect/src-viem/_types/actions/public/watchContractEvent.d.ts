import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { GetEventArgs, InferEventName } from '../../types/contract.js'
import type { Log } from '../../types/log.js'
import type { GetTransportConfig } from '../../types/transport.js'
import type { Abi, Address, ExtractAbiEvent } from 'abitype'
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
export type WatchContractEventOnLogsParameter<
	TAbi extends Abi | readonly unknown[] = readonly unknown[],
	TEventName extends string = string,
	TStrict extends boolean | undefined = undefined,
> = TAbi extends Abi
	? Log<bigint, number, false, ExtractAbiEvent<TAbi, TEventName>, TStrict>[]
	: Log[]
export type WatchContractEventOnLogsFn<
	TAbi extends Abi | readonly unknown[] = readonly unknown[],
	TEventName extends string = string,
	TStrict extends boolean | undefined = undefined,
> = (logs: WatchContractEventOnLogsParameter<TAbi, TEventName, TStrict>) => void
export type WatchContractEventParameters<
	TAbi extends Abi | readonly unknown[] = readonly unknown[],
	TEventName extends string = string,
	TStrict extends boolean | undefined = undefined,
> = {
	/** The address of the contract. */
	address?: Address | Address[]
	/** Contract ABI. */
	abi: TAbi
	args?: GetEventArgs<TAbi, TEventName>
	/** Contract event. */
	eventName?: InferEventName<TAbi, TEventName>
	/** The callback to call when an error occurred when trying to get for a new block. */
	onError?: (error: Error) => void
	/** The callback to call when new event logs are received. */
	onLogs: WatchContractEventOnLogsFn<TAbi, TEventName, TStrict>
	/**
	 * Whether or not the logs must match the indexed/non-indexed arguments on `event`.
	 * @default false
	 */
	strict?: TStrict
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
	  })
export type WatchContractEventReturnType = () => void
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
export declare function watchContractEvent<
	TChain extends Chain | undefined,
	const TAbi extends Abi | readonly unknown[],
	TEventName extends string,
	TStrict extends boolean | undefined = undefined,
>(
	client: Client<Transport, TChain>,
	{
		abi,
		address,
		args,
		batch,
		eventName,
		onError,
		onLogs,
		poll: poll_,
		pollingInterval,
		strict: strict_,
	}: WatchContractEventParameters<TAbi, TEventName, TStrict>,
): WatchContractEventReturnType
export {}
//# sourceMappingURL=watchContractEvent.d.ts.map
