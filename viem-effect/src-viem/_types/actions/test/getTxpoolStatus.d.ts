import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
export type GetTxpoolStatusReturnType = {
    pending: number;
    queued: number;
};
/**
 * Returns a summary of all the transactions currently pending for inclusion in the next block(s), as well as the ones that are being scheduled for future execution only.
 *
 * - Docs: https://viem.sh/docs/actions/test/getTxpoolStatus.html
 *
 * @param client - Client to use
 * @returns Transaction pool status. {@link GetTxpoolStatusReturnType}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { getTxpoolStatus } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * const status = await getTxpoolStatus(client)
 */
export declare function getTxpoolStatus<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>): Promise<GetTxpoolStatusReturnType>;
//# sourceMappingURL=getTxpoolStatus.d.ts.map