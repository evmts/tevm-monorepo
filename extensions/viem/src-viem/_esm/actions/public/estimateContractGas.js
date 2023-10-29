import { parseAccount } from '../../accounts/utils/parseAccount.js'
import { encodeFunctionData } from '../../utils/abi/encodeFunctionData.js'
import { getContractError } from '../../utils/errors/getContractError.js'
import { estimateGas } from './estimateGas.js'
/**
 * Estimates the gas required to successfully execute a contract write function call.
 *
 * - Docs: https://viem.sh/docs/contract/estimateContractGas.html
 *
 * Internally, uses a [Public Client](https://viem.sh/docs/clients/public.html) to call the [`estimateGas` action](https://viem.sh/docs/actions/public/estimateGas.html) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData.html).
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateContractGasParameters}
 * @returns The gas estimate (in wei). {@link EstimateContractGasReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateContractGas } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const gas = await estimateContractGas(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint() public']),
 *   functionName: 'mint',
 *   account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 * })
 */
export async function estimateContractGas(
	client,
	{ abi, address, args, functionName, ...request },
) {
	const data = encodeFunctionData({
		abi,
		args,
		functionName,
	})
	try {
		const gas = await estimateGas(client, {
			data,
			to: address,
			...request,
		})
		return gas
	} catch (err) {
		const account = request.account ? parseAccount(request.account) : undefined
		throw getContractError(err, {
			abi: abi,
			address,
			args,
			docsPath: '/docs/contract/estimateContractGas',
			functionName,
			sender: account?.address,
		})
	}
}
//# sourceMappingURL=estimateContractGas.js.map
