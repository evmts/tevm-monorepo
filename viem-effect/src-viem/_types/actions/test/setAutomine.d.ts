import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
/**
 * Enables or disables the automatic mining of new blocks with each new transaction submitted to the network.
 *
 * - Docs: https://viem.sh/docs/actions/test/setAutomine.html
 *
 * @param client - Client to use
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setAutomine } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setAutomine(client)
 */
export declare function setAutomine<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, enabled: boolean): Promise<void>;
//# sourceMappingURL=setAutomine.d.ts.map