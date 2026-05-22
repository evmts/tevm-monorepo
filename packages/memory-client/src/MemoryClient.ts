import type { Address } from '@tevm/utils'
import type { Account, Chain, Client, PublicActions, TestActions, WalletActions } from 'viem'
import type { Prettify } from 'viem/chains'
import type { TevmActions } from './TevmActions.js'
import type { TevmRpcSchema } from './TevmRpcSchema.js'
import type { TevmTransport } from './TevmTransport.js'

/**
 * Represents a TEVM-enhanced viem client with an in-memory Ethereum client as its transport.
 *
 * Combines TEVM actions with viem public, wallet, and test actions for a complete in-browser
 * EVM development and testing environment, including forking, mining control, and state persistence.
 *
 * @see {@link createMemoryClient} for creating an instance.
 * @see [Client Guide](https://tevm.sh/learn/clients/)
 * @see [Actions Guide](https://tevm.sh/learn/actions/)
 *
 * @example
 * ```typescript
 * import { createMemoryClient, http } from "tevm";
 * import { optimism } from "tevm/common";
 *
 * const client = createMemoryClient({
 *   fork: { transport: http("https://mainnet.optimism.io")({}) },
 *   common: optimism,
 * });
 * await client.tevmReady();
 * const bn = await client.getBlockNumber();
 * ```
 */
export type MemoryClient<
	TChain extends Chain | undefined = Chain | undefined,
	TAccountOrAddress extends Account | Address | undefined = Account | Address | undefined,
> = Prettify<
	Client<
		TevmTransport,
		TChain,
		TAccountOrAddress extends Account ? Account : undefined,
		TevmRpcSchema,
		TevmActions &
			PublicActions<TevmTransport, TChain, TAccountOrAddress extends Account ? Account : undefined> &
			WalletActions<TChain, TAccountOrAddress extends Account ? Account : undefined> &
			TestActions
	>
>
