import type { Address } from 'abitype';
import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
export type InspectTxpoolReturnType = {
    pending: Record<Address, Record<string, string>>;
    queued: Record<Address, Record<string, string>>;
};
/**
 * Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.
 *
 * - Docs: https://viem.sh/docs/actions/test/inspectTxpool.html
 *
 * @param client - Client to use
 * @returns Transaction pool inspection data. {@link InspectTxpoolReturnType}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { inspectTxpool } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * const data = await inspectTxpool(client)
 */
export declare function inspectTxpool<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>): Promise<InspectTxpoolReturnType>;
//# sourceMappingURL=inspectTxpool.d.ts.map