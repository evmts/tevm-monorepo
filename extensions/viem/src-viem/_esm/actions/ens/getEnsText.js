import {
	textResolverAbi,
	universalResolverResolveAbi,
} from '../../constants/abis.js'
import { decodeFunctionResult } from '../../utils/abi/decodeFunctionResult.js'
import { encodeFunctionData } from '../../utils/abi/encodeFunctionData.js'
import { getChainContractAddress } from '../../utils/chain.js'
import { toHex } from '../../utils/encoding/toHex.js'
import { isNullUniversalResolverError } from '../../utils/ens/errors.js'
import { namehash } from '../../utils/ens/namehash.js'
import { packetToBytes } from '../../utils/ens/packetToBytes.js'
import { readContract } from '../public/readContract.js'
/**
 * Gets a text record for specified ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsResolver.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/ens
 *
 * Calls `resolve(bytes, bytes)` on ENS Universal Resolver Contract.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize.html) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsTextParameters}
 * @returns Address for ENS resolver. {@link GetEnsTextReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsText, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const twitterRecord = await getEnsText(client, {
 *   name: normalize('wagmi-dev.eth'),
 *   key: 'com.twitter',
 * })
 * // 'wagmi_sh'
 */
export async function getEnsText(
	client,
	{
		blockNumber,
		blockTag,
		name,
		key,
		universalResolverAddress: universalResolverAddress_,
	},
) {
	let universalResolverAddress = universalResolverAddress_
	if (!universalResolverAddress) {
		if (!client.chain)
			throw new Error(
				'client chain not configured. universalResolverAddress is required.',
			)
		universalResolverAddress = getChainContractAddress({
			blockNumber,
			chain: client.chain,
			contract: 'ensUniversalResolver',
		})
	}
	try {
		const res = await readContract(client, {
			address: universalResolverAddress,
			abi: universalResolverResolveAbi,
			functionName: 'resolve',
			args: [
				toHex(packetToBytes(name)),
				encodeFunctionData({
					abi: textResolverAbi,
					functionName: 'text',
					args: [namehash(name), key],
				}),
			],
			blockNumber,
			blockTag,
		})
		if (res[0] === '0x') return null
		const record = decodeFunctionResult({
			abi: textResolverAbi,
			functionName: 'text',
			data: res[0],
		})
		return record === '' ? null : record
	} catch (err) {
		if (isNullUniversalResolverError(err, 'resolve')) return null
		throw err
	}
}
//# sourceMappingURL=getEnsText.js.map
