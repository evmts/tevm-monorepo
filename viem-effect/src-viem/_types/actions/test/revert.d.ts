import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
import type { Quantity } from '../../types/rpc.js';
export type RevertParameters = {
    /** The snapshot ID to revert to. */
    id: Quantity;
};
/**
 * Revert the state of the blockchain at the current block.
 *
 * - Docs: https://viem.sh/docs/actions/test/revert.html
 *
 * @param client - Client to use
 * @param parameters – {@link RevertParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { revert } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await revert(client, { id: '0x…' })
 */
export declare function revert<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, { id }: RevertParameters): Promise<void>;
//# sourceMappingURL=revert.d.ts.map