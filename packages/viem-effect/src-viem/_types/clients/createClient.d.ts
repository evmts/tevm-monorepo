import type { Account, JsonRpcAccount } from '../accounts/types.js'
import type { Chain } from '../types/chain.js'
import type {
	EIP1193RequestFn,
	EIP1474Methods,
	RpcSchema,
} from '../types/eip1193.js'
import type { Prettify } from '../types/utils.js'
import type { Transport } from './transports/createTransport.js'
import type { Address } from 'abitype'
export type ClientConfig<
	transport extends Transport = Transport,
	chain extends Chain | undefined = Chain | undefined,
	accountOrAddress extends Account | Address | undefined =
		| Account
		| Address
		| undefined,
> = {
	/** The Account to use for the Client. This will be used for Actions that require an account as an argument. */
	account?: accountOrAddress | Account | Address | undefined
	/** Flags for batch settings. */
	batch?:
		| {
				/** Toggle to enable `eth_call` multicall aggregation. */
				multicall?: boolean | Prettify<MulticallBatchOptions> | undefined
		  }
		| undefined
	/**
	 * Time (in ms) that cached data will remain in memory.
	 * @default 4_000
	 */
	cacheTime?: number | undefined
	/** Chain for the client. */
	chain?: Chain | undefined | chain
	/** A key for the client. */
	key?: string | undefined
	/** A name for the client. */
	name?: string | undefined
	/**
	 * Frequency (in ms) for polling enabled actions & events.
	 * @default 4_000
	 */
	pollingInterval?: number | undefined
	/** The RPC transport */
	transport: transport
	/** The type of client. */
	type?: string | undefined
}
export type Client<
	transport extends Transport = Transport,
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	rpcSchema extends RpcSchema | undefined = undefined,
	extended extends Extended | undefined = Extended | undefined,
> = Client_Base<transport, chain, account, rpcSchema> &
	(extended extends Extended ? extended : unknown) & {
		extend: <const client extends Extended>(
			fn: (
				client: Client<transport, chain, account, rpcSchema, extended>,
			) => client,
		) => Client<
			transport,
			chain,
			account,
			rpcSchema,
			Prettify<client> & (extended extends Extended ? extended : unknown)
		>
	}
type Client_Base<
	transport extends Transport = Transport,
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
	rpcSchema extends RpcSchema | undefined = undefined,
> = {
	/** The Account of the Client. */
	account: account
	/** Flags for batch settings. */
	batch?: ClientConfig['batch']
	/** Time (in ms) that cached data will remain in memory. */
	cacheTime: number
	/** Chain for the client. */
	chain: chain
	/** A key for the client. */
	key: string
	/** A name for the client. */
	name: string
	/** Frequency (in ms) for polling enabled actions & events. Defaults to 4_000 milliseconds. */
	pollingInterval: number
	/** Request function wrapped with friendly error handling */
	request: EIP1193RequestFn<
		rpcSchema extends undefined ? EIP1474Methods : rpcSchema
	>
	/** The RPC transport */
	transport: ReturnType<transport>['config'] & ReturnType<transport>['value']
	/** The type of client. */
	type: string
	/** A unique ID for the client. */
	uid: string
}
type Extended = Prettify<
	{
		[K in keyof Client_Base]?: undefined
	} & {
		[key: string]: unknown
	}
>
export type MulticallBatchOptions = {
	/** The maximum size (in bytes) for each calldata chunk. @default 1_024 */
	batchSize?: number | undefined
	/** The maximum number of milliseconds to wait before sending a batch. @default 0 */
	wait?: number | undefined
}
/**
 * Creates a base client with the given transport.
 */
export declare function createClient<
	transport extends Transport,
	chain extends Chain | undefined = undefined,
	accountOrAddress extends Account | Address | undefined = undefined,
>(
	parameters: ClientConfig<transport, chain, accountOrAddress>,
): Prettify<
	Client<
		transport,
		chain,
		accountOrAddress extends Address
			? Prettify<JsonRpcAccount<accountOrAddress>>
			: accountOrAddress
	>
>
export {}
//# sourceMappingURL=createClient.d.ts.map
