import type {
	TestClient,
	TestClientMode,
} from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
export type SetNextBlockTimestampParameters = {
	/** The timestamp (in seconds). */
	timestamp: bigint
}
/**
 * Sets the next block's timestamp.
 *
 * - Docs: https://viem.sh/docs/actions/test/setNextBlockTimestamp.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetNextBlockTimestampParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setNextBlockTimestamp } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setNextBlockTimestamp(client, { timestamp: 1671744314n })
 */
export declare function setNextBlockTimestamp<
	TChain extends Chain | undefined,
	TAccount extends Account | undefined,
>(
	client: TestClient<TestClientMode, Transport, TChain, TAccount, false>,
	{ timestamp }: SetNextBlockTimestampParameters,
): Promise<void>
//# sourceMappingURL=setNextBlockTimestamp.d.ts.map
