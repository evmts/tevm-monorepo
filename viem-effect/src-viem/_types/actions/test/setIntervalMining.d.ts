import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
export type SetIntervalMiningParameters = {
    /** The mining interval. */
    interval: number;
};
/**
 * Sets the automatic mining interval (in seconds) of blocks. Setting the interval to 0 will disable automatic mining.
 *
 * - Docs: https://viem.sh/docs/actions/test/setIntervalMining.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetIntervalMiningParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setIntervalMining } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setIntervalMining(client, { interval: 5 })
 */
export declare function setIntervalMining<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, { interval }: SetIntervalMiningParameters): Promise<void>;
//# sourceMappingURL=setIntervalMining.d.ts.map