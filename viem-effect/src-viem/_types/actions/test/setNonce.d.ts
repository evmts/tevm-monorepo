import type { Address } from 'abitype';
import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
export type SetNonceParameters = {
    /** The account address. */
    address: Address;
    /** The nonce to set. */
    nonce: number;
};
/**
 * Modifies (overrides) the nonce of an account.
 *
 * - Docs: https://viem.sh/docs/actions/test/setNonce.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetNonceParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setNonce } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setNonce(client, {
 *   address: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   nonce: 420,
 * })
 */
export declare function setNonce<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, { address, nonce }: SetNonceParameters): Promise<void>;
//# sourceMappingURL=setNonce.d.ts.map