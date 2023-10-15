import type { Address } from 'abitype';
import type { TestClient, TestClientMode } from '../../clients/createTestClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Account } from '../../types/account.js';
import type { Chain } from '../../types/chain.js';
import type { Hex } from '../../types/misc.js';
export type SetCodeParameters = {
    /** The account address. */
    address: Address;
    /** The bytecode to set */
    bytecode: Hex;
};
/**
 * Modifies the bytecode stored at an account's address.
 *
 * - Docs: https://viem.sh/docs/actions/test/setCode.html
 *
 * @param client - Client to use
 * @param parameters – {@link SetCodeParameters}
 *
 * @example
 * import { createTestClient, http } from 'viem'
 * import { foundry } from 'viem/chains'
 * import { setCode } from 'viem/test'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: 'foundry',
 *   transport: http(),
 * })
 * await setCode(client, {
 *   address: '0xe846c6fcf817734ca4527b28ccb4aea2b6663c79',
 *   bytecode: '0x60806040526000600355600019600955600c80546001600160a01b031916737a250d5630b4cf539739df…',
 * })
 */
export declare function setCode<TChain extends Chain | undefined, TAccount extends Account | undefined>(client: TestClient<TestClientMode, Transport, TChain, TAccount, false>, { address, bytecode }: SetCodeParameters): Promise<void>;
//# sourceMappingURL=setCode.d.ts.map