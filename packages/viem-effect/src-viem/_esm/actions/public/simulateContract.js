import { parseAccount } from '../../accounts/utils/parseAccount.js'
import { decodeFunctionResult } from '../../utils/abi/decodeFunctionResult.js'
import { encodeFunctionData } from '../../utils/abi/encodeFunctionData.js'
import { getContractError } from '../../utils/errors/getContractError.js'
import { call } from './call.js'
/**
 * Simulates/validates a contract interaction. This is useful for retrieving **return data** and **revert reasons** of contract write functions.
 *
 * - Docs: https://viem.sh/docs/contract/simulateContract.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/contracts/writing-to-contracts
 *
 * This function does not require gas to execute and _**does not**_ change the state of the blockchain. It is almost identical to [`readContract`](https://viem.sh/docs/contract/readContract.html), but also supports contract write functions.
 *
 * Internally, uses a [Public Client](https://viem.sh/docs/clients/public.html) to call the [`call` action](https://viem.sh/docs/actions/public/call.html) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData.html).
 *
 * @param client - Client to use
 * @param parameters - {@link SimulateContractParameters}
 * @returns The simulation result and write request. {@link SimulateContractReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { simulateContract } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const result = await simulateContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32) view returns (uint32)']),
 *   functionName: 'mint',
 *   args: ['69420'],
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
export async function simulateContract(
	client,
	{ abi, address, args, dataSuffix, functionName, ...callRequest },
) {
	const account = callRequest.account
		? parseAccount(callRequest.account)
		: undefined
	const calldata = encodeFunctionData({
		abi,
		args,
		functionName,
	})
	try {
		const { data } = await call(client, {
			batch: false,
			data: `${calldata}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
			to: address,
			...callRequest,
		})
		const result = decodeFunctionResult({
			abi,
			args,
			functionName,
			data: data || '0x',
		})
		return {
			result,
			request: {
				abi,
				address,
				args,
				dataSuffix,
				functionName,
				...callRequest,
			},
		}
	} catch (err) {
		throw getContractError(err, {
			abi: abi,
			address,
			args,
			docsPath: '/docs/contract/simulateContract',
			functionName,
			sender: account?.address,
		})
	}
}
//# sourceMappingURL=simulateContract.js.map
