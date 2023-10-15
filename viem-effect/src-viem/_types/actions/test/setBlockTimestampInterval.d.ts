import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
export type SetBlockTimestampIntervalParameters = {
    /** The interval (in seconds). */
    interval: number;
};
/**
 * Similar to [`increaseTime`](https://viem.sh/docs/actions/test/increaseTime.html), but sets a block timestamp `interval`. The timestamp of future blocks will be computed as `lastBlock_timestamp` + `interval`.
 *
 * - Docs: https://viem.sh/docs/actions/test/setBlockTimestampInterval.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetBlockTimestampIntervalParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setBlockTimestampInterval } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setBlockTimestampInterval(client, { interval: 5 })
 */
export declare function setBlockTimestampInterval<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, { interval }: SetBlockTimestampIntervalParameters): Promise<void>;
//# sourceMappingURL=setBlockTimestampInterval.d.ts.map