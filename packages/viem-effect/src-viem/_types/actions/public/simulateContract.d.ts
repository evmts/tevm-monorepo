import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type {
	ContractFunctionConfig,
	ContractFunctionResult,
	GetValue,
} from '../../types/contract.js'
import type { Hex } from '../../types/misc.js'
import type { UnionOmit } from '../../types/utils.js'
import type { WriteContractParameters } from '../wallet/writeContract.js'
import { type CallParameters } from './call.js'
import type { Abi } from 'abitype'
export type SimulateContractParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = any,
	TChain extends Chain | undefined = Chain | undefined,
	TChainOverride extends Chain | undefined = Chain | undefined,
> = {
	chain?: TChainOverride
	/** Data to append to the end of the calldata. Useful for adding a ["domain" tag](https://opensea.notion.site/opensea/Seaport-Order-Attributions-ec2d69bf455041a5baa490941aad307f). */
	dataSuffix?: Hex
} & ContractFunctionConfig<TAbi, TFunctionName, 'payable' | 'nonpayable'> &
	UnionOmit<
		CallParameters<TChainOverride extends Chain ? TChainOverride : TChain>,
		'batch' | 'to' | 'data' | 'value'
	> &
	GetValue<
		TAbi,
		TFunctionName,
		CallParameters<TChain> extends CallParameters
			? CallParameters<TChain>['value']
			: CallParameters['value']
	>
export type SimulateContractReturnType<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends string = string,
	TChain extends Chain | undefined = Chain | undefined,
	TChainOverride extends Chain | undefined = Chain | undefined,
> = {
	result: ContractFunctionResult<TAbi, TFunctionName>
	request: UnionOmit<
		WriteContractParameters<
			TAbi,
			TFunctionName,
			TChain,
			undefined,
			TChainOverride
		>,
		'chain' | 'functionName'
	> & {
		chain: TChainOverride
		functionName: TFunctionName
	} & ContractFunctionConfig<TAbi, TFunctionName, 'payable' | 'nonpayable'>
}
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
export declare function simulateContract<
	TChain extends Chain | undefined,
	const TAbi extends Abi | readonly unknown[],
	TFunctionName extends string,
	TChainOverride extends Chain | undefined,
>(
	client: Client<Transport, TChain>,
	{
		abi,
		address,
		args,
		dataSuffix,
		functionName,
		...callRequest
	}: SimulateContractParameters<TAbi, TFunctionName, TChain, TChainOverride>,
): Promise<
	SimulateContractReturnType<TAbi, TFunctionName, TChain, TChainOverride>
>
//# sourceMappingURL=simulateContract.d.ts.map
