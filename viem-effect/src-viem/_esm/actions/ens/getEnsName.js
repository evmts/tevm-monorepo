import { universalResolverReverseAbi } from '../../constants/abis.js';
import { getChainContractAddress } from '../../utils/chain.js';
import { toHex } from '../../utils/encoding/toHex.js';
import { isNullUniversalResolverError } from '../../utils/ens/errors.js';
import { packetToBytes } from '../../utils/ens/packetToBytes.js';
import { readContract, } from '../public/readContract.js';
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
export async function getEnsName(client, { address, blockNumber, blockTag, universalResolverAddress: universalResolverAddress_, }) {
    let universalResolverAddress = universalResolverAddress_;
    if (!universalResolverAddress) {
        if (!client.chain)
            throw new Error('client chain not configured. universalResolverAddress is required.');
        universalResolverAddress = getChainContractAddress({
            blockNumber,
            chain: client.chain,
            contract: 'ensUniversalResolver',
        });
    }
    const reverseNode = `${address.toLowerCase().substring(2)}.addr.reverse`;
    try {
        const res = await readContract(client, {
            address: universalResolverAddress,
            abi: universalResolverReverseAbi,
            functionName: 'reverse',
            args: [toHex(packetToBytes(reverseNode))],
            blockNumber,
            blockTag,
        });
        return res[0];
    }
    catch (err) {
        if (isNullUniversalResolverError(err, 'reverse'))
            return null;
        throw err;
    }
}
//# sourceMappingURL=getEnsName.js.map