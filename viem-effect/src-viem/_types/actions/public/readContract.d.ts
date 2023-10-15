import type { Abi } from 'abitype';
import type { Client } from '../../clients/createClient.js';
import type { Transport } from '../../clients/transports/createTransport.js';
import type { Chain } from '../../types/chain.js';
import type { ContractFunctionConfig, ContractFunctionResult } from '../../types/contract.js';
import { type CallParameters } from './call.js';
export type ReadContractParameters<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = Pick<CallParameters, 'account' | 'blockNumber' | 'blockTag'> & ContractFunctionConfig<TAbi, TFunctionName, 'view' | 'pure'>;
export type ReadContractReturnType<TAbi extends Abi | readonly unknown[] = Abi, TFunctionName extends string = string> = ContractFunctionResult<TAbi, TFunctionName>;
/**
 * Calls a read-only function on a contract, and returns the response.
 *
 * - Docs: https://viem.sh/docs/contract/readContract.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/contracts/reading-contracts
 *
 * A "read-only" function (constant function) on a Solidity contract is denoted by a `view` or `pure` keyword. They can only read the state of the contract, and cannot make any changes to it. Since read-only methods do not change the state of the contract, they do not require any gas to be executed, and can be called by any user without the need to pay for gas.
 *
 * Internally, uses a [Public Client](https://viem.sh/docs/clients/public.html) to call the [`call` action](https://viem.sh/docs/actions/public/call.html) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData.html).
 *
 * @param client - Client to use
 * @param parameters - {@link ReadContractParameters}
 * @returns The response from the contract. Type is inferred. {@link ReadContractReturnType}
 *
 * @example
 * import { createPublicClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { readContract } from 'viem/contract'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const result = await readContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
 *   functionName: 'balanceOf',
 *   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
 * })
 * // 424122n
 */
export declare function readContract<TChain extends Chain | undefined, const TAbi extends Abi | readonly unknown[], TFunctionName extends string>(client: Client<Transport, TChain>, { abi, address, args, functionName, ...callRequest }: ReadContractParameters<TAbi, TFunctionName>): Promise<ReadContractReturnType<TAbi, TFunctionName>>;
//# sourceMappingURL=readContract.d.ts.map