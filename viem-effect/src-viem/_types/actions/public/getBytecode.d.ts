import type { Address } from 'abitype';
import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { BlockTag } from '../../types/block.js';
import type { Chain } from '../../types/chain.js';
import type { Hex } from '../../types/misc.js';
export type GetBytecodeParameters = {
    address: Address;
} & ({
    blockNumber?: never;
    blockTag?: BlockTag;
} | {
    blockNumber?: bigint;
    blockTag?: never;
});
export type GetBytecodeReturnType = Hex | undefined;
/**
 * Retrieves the bytecode at an address.
 *
 * - Docs: https://viem.sh/docs/contract/getBytecode.html
 * - JSON-RPC Methods: [`eth_getCode`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getcode)
 *
 * @param client - Client to use
 * @param parameters - {@link GetBytecodeParameters}
 * @returns The contract's bytecode. {@link GetBytecodeReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBytecode } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const code = await getBytecode(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 * })
 */
export declare function getBytecode<TChain extends Chain | undefined>(client: Client<Transport, TChain>, { address, blockNumber, blockTag }: GetBytecodeParameters): Promise<GetBytecodeReturnType>;
//# sourceMappingURL=getBytecode.d.ts.map