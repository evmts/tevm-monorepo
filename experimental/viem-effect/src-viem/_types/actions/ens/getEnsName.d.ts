import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { Prettify } from '../../types/utils.js'
import { type ReadContractParameters } from '../public/readContract.js'
import type { Address } from 'abitype'
export type GetEnsNameParameters = Prettify<
	Pick<ReadContractParameters, 'blockNumber' | 'blockTag'> & {
		/** Address to get ENS name for. */
		address: Address
		/** Address of ENS Universal Resolver Contract. */
		universalResolverAddress?: Address
	}
>
export type GetEnsNameReturnType = string | null
/**
 * Gets primary name for specified address.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsName.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/ens
 *
 * Calls `reverse(bytes)` on ENS Universal Resolver Contract to "reverse resolve" the address to the primary ENS name.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsNameParameters}
 * @returns Name or `null` if not found. {@link GetEnsNameReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsName } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const ensName = await getEnsName(client, {
 *   address: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
 * })
 * // 'wagmi-dev.eth'
 */
export declare function getEnsName<TChain extends Chain | undefined>(
	client: Client<Transport, TChain>,
	{
		address,
		blockNumber,
		blockTag,
		universalResolverAddress: universalResolverAddress_,
	}: GetEnsNameParameters,
): Promise<GetEnsNameReturnType>
//# sourceMappingURL=getEnsName.d.ts.map
