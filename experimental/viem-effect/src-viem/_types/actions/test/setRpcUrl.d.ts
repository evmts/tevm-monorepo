import type {
	TestClient,
	TestClientMode,
} from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
/**
 * Sets the backend RPC URL.
 *
 * - Docs: https://viem.sh/docs/actions/test/setRpcUrl.html
 *
 * @param client - Client to use
 * @param jsonRpcUrl – RPC URL
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setRpcUrl } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setRpcUrl(client, 'https://eth-mainnet.g.alchemy.com/v2')
 */
export declare function setRpcUrl<
	TChain extends Chain | undefined,
	TAccount extends Account | undefined,
>(
	client: TestClient<TestClientMode, Transport, TChain, TAccount, false>,
	jsonRpcUrl: string,
): Promise<void>
//# sourceMappingURL=setRpcUrl.d.ts.map
