import type { Account } from '../accounts/types.js'
import type { ParseAccount } from '../types/account.js'
import type { Chain } from '../types/chain.js'
import type { TestRpcSchema } from '../types/eip1193.js'
import type { Prettify } from '../types/utils.js'
import { type Client, type ClientConfig } from './createClient.js'
import { type TestActions } from './decorators/test.js'
import type { Transport } from './transports/createTransport.js'
import type { Address } from 'abitype'
export type TestClientMode = 'anvil' | 'hardhat' | 'ganache'
export type TestClientConfig<
	mode extends TestClientMode = TestClientMode,
	transport extends Transport = Transport,
	chain extends Chain | undefined = Chain | undefined,
	accountOrAddress extends Account | Address | undefined =
		| Account
		| Address
		| undefined,
> = Prettify<
	Pick<
		ClientConfig<transport, chain, accountOrAddress>,
		| 'account'
		| 'cacheTime'
		| 'chain'
		| 'key'
		| 'name'
		| 'pollingInterval'
		| 'transport'
	> & {
		/** Mode of the test client. */
		mode: mode | ('anvil' | 'hardhat' | 'ganache')
	}
>
export type TestClient<
	TMode extends TestClientMode = TestClientMode,
	transport extends Transport = Transport,
	chain extends Chain | undefined = Chain | undefined,
	TAccount extends Account | undefined = Account | undefined,
	TIncludeActions extends boolean = true,
> = Prettify<
	{
		mode: TMode
	} & Client<
		transport,
		chain,
		TAccount,
		TestRpcSchema<TMode>,
		TIncludeActions extends true ? TestActions : Record<string, unknown>
	>
>
/**
 * @description Creates a test client with a given transport.
 */
/**
 * Creates a Test Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * - Docs: https://viem.sh/docs/clients/test.html
 *
 * A Test Client is an interface to "test" JSON-RPC API methods accessible through a local Ethereum test node such as [Anvil](https://book.getfoundry.sh/anvil/) or [Hardhat](https://hardhat.org/) such as mining blocks, impersonating accounts, setting fees, etc through [Test Actions](https://viem.sh/docs/actions/test/introduction.html).
 *
 * @param config - {@link TestClientConfig}
 * @returns A Test Client. {@link TestClient}
 *
 * @example
 * import { createTestClient, custom } from 'viem'
 * import { foundry } from 'viem/chains'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: foundry,
 *   transport: http(),
 * })
 */
export declare function createTestClient<
	mode extends 'anvil' | 'hardhat' | 'ganache', // TODO: Type utility that expands `TestClientMode`
	transport extends Transport,
	chain extends Chain | undefined = undefined,
	accountOrAddress extends Account | Address | undefined = undefined,
>(
	parameters: TestClientConfig<mode, transport, chain, accountOrAddress>,
): TestClient<mode, transport, chain, ParseAccount<accountOrAddress>>
//# sourceMappingURL=createTestClient.d.ts.map
