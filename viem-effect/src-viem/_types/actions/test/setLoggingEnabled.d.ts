import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
/**
 * Enable or disable logging on the test node network.
 *
 * - Docs: https://viem.sh/docs/actions/test/setLoggingEnabled.html
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setLoggingEnabled } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setLoggingEnabled(client)
 */
export declare function setLoggingEnabled<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, enabled: boolean): Promise<void>;
//# sourceMappingURL=setLoggingEnabled.d.ts.map