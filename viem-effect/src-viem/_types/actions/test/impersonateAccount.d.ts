import type { Address } from 'abitype';
import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
export type ImpersonateAccountParameters = {
    /** The account to impersonate. */
    address: Address;
};
/**
 * Impersonate an account or contract address. This lets you send transactions from that account even if you don't have access to its private key.
 *
 * - Docs: https://viem.sh/docs/actions/test/impersonateAccount.html
 *
 * @param client - Client to use
 * @param parameters - {@link ImpersonateAccountParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { impersonateAccount } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * const content = await impersonateAccount(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
export declare function impersonateAccount<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, { address }: ImpersonateAccountParameters): Promise<void>;
//# sourceMappingURL=impersonateAccount.d.ts.map