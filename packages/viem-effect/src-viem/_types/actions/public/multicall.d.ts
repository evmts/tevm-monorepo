import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Chain } from '../../types/chain.js'
import type { ContractFunctionConfig } from '../../types/contract.js'
import type {
	MulticallContracts,
	MulticallResults,
} from '../../types/multicall.js'
import type { CallParameters } from './call.js'
import type { Address, Narrow } from 'abitype'
export type MulticallParameters<
	TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[],
	TAllowFailure extends boolean = true,
> = Pick<CallParameters, 'blockNumber' | 'blockTag'> & {
	allowFailure?: TAllowFailure
	/** The maximum size (in bytes) for each calldata chunk. Set to `0` to disable the size limit. @default 1_024 */
	batchSize?: number
	contracts: Narrow<readonly [...MulticallContracts<TContracts>]>
	multicallAddress?: Address
}
export type MulticallReturnType<
	TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[],
	TAllowFailure extends boolean = true,
> = MulticallResults<TContracts, TAllowFailure>
/**
 * Similar to [`readContract`](https://viem.sh/docs/contract/readContract.html), but batches up multiple functions on a contract in a single RPC call via the [`multicall3` contract](https://github.com/mds1/multicall).
 *
 * - Docs: https://viem.sh/docs/contract/multicall.html
 *
 * @param client - Client to use
 * @param parameters - {@link MulticallParameters}
 * @returns An array of results with accompanying status. {@link MulticallReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { multicall } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const abi = parseAbi([
 *   'function balanceOf(address) view returns (uint256)',
 *   'function totalSupply() view returns (uint256)',
 * ])
 * const results = await multicall(client, {
 *   contracts: [
 *     {
 *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *       abi,
 *       functionName: 'balanceOf',
 *       args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
 *     },
 *     {
 *       address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *       abi,
 *       functionName: 'totalSupply',
 *     },
 *   ],
 * })
 * // [{ result: 424122n, status: 'success' }, { result: 1000000n, status: 'success' }]
 */
export declare function multicall<
	TContracts extends ContractFunctionConfig[],
	TChain extends Chain | undefined,
	TAllowFailure extends boolean = true,
>(
	client: Client<Transport, TChain>,
	args: MulticallParameters<TContracts, TAllowFailure>,
): Promise<MulticallReturnType<TContracts, TAllowFailure>>
//# sourceMappingURL=multicall.d.ts.map
