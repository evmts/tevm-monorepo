import type {
	TestClient,
	TestClientMode,
} from '../../clients/createTestClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
export type SetBlockGasLimitParameters = {
	/** Gas limit (in wei). */
	gasLimit: bigint
}
/**
 * Sets the block's gas limit.
 *
 * - Docs: https://viem.sh/docs/actions/test/setBlockGasLimit.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetBlockGasLimitParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setBlockGasLimit } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setBlockGasLimit(client, { gasLimit: 420_000n })
 */
export declare function setBlockGasLimit<
	TChain extends Chain | undefined,
	TAccount extends Account | undefined,
>(
	client: TestClient<TestClientMode, Transport, TChain, TAccount, false>,
	{ gasLimit }: SetBlockGasLimitParameters,
): Promise<void>
//# sourceMappingURL=setBlockGasLimit.d.ts.map
