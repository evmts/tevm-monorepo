import type { Abi, Address, FormatAbi, Hex } from '@tevm/utils'
import type { Contract } from './Contract.js'
import type { CreateContractParams } from './CreateContractParams.js'

/**
 * Type of `createContract` factory function.
 * Creates a tevm Contract instance from a human readable ABI or JSON ABI.
 *
 * @typeParam TName - The name of the contract
 * @typeParam TAbi - The ABI type (either string[] for human readable or Abi for JSON)
 * @typeParam TAddress - The contract address type (optional)
 * @typeParam TBytecode - The contract bytecode type (optional)
 * @typeParam TDeployedBytecode - The deployed bytecode type (optional)
 * @typeParam TCode - The runtime bytecode type (optional)
 *
 * @example
 * Using a human readable ABI:
 * ```typescript
 * import { type Contract, createContract } from 'tevm/contract'
 *
 * const contract: Contract = createContract({
 *   name: 'ERC20',
 *   humanReadableAbi: [
 *     'function balanceOf(address owner) view returns (uint256)',
 *     'function transfer(address to, uint256 amount) returns (bool)',
 *     'event Transfer(address indexed from, address indexed to, uint256 value)',
 *   ],
 * })
 * ```
 *
 * @example
 * Using a JSON ABI (needs to be formatted):
 * ```typescript
 * import { type Contract, createContract } from 'tevm/contract'
 * import { formatAbi } from '@tevm/utils'
 *
 * const jsonAbi = [
 *   {
 *     "inputs": [{"name": "owner", "type": "address"}],
 *     "name": "balanceOf",
 *     "outputs": [{"type": "uint256"}],
 *     "stateMutability": "view",
 *     "type": "function"
 *   },
 *   {
 *     "inputs": [
 *       {"name": "to", "type": "address"},
 *       {"name": "amount", "type": "uint256"}
 *     ],
 *     "name": "transfer",
 *     "outputs": [{"type": "bool"}],
 *     "stateMutability": "nonpayable",
 *     "type": "function"
 *   },
 *   {
 *     "anonymous": false,
 *     "inputs": [
 *       {"indexed": true, "name": "from", "type": "address"},
 *       {"indexed": true, "name": "to", "type": "address"},
 *       {"indexed": false, "name": "value", "type": "uint256"}
 *     ],
 *     "name": "Transfer",
 *     "type": "event"
 *   }
 * ]
 *
 * const contract = createContract({
 *   name: 'ERC20',
 *   abi: formatAbi(jsonAbi),
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI token address on Ethereum mainnet
 *   bytecode: '0x60806040526000805534801561001457600080fd5b50610771806100246000396000f3fe',  // Example bytecode (truncated)
 *   deployedBytecode: '0x608060405234801561001057600080fd5b50600436106100885760003560e01c806370a082311161005b57806370a08231146101bc', // Example deployed bytecode (truncated)
 *   code: '0x608060405234801561001057600080fd5b50600436106100885760003560e01c806370a082311161005b57806370a08231146101bc',  // Example runtime code (truncated)
 * })
 * ```
 */
export type CreateContractFn = <
	TName extends string,
	TAbi extends readonly string[] | Abi,
	TAddress extends undefined | Address = undefined,
	// Bytecode is the contract bytecode with constructor
	TBytecode extends undefined | Hex = undefined,
	// DeployedBytecode is the raw bytecode without constructor
	TDeployedBytecode extends undefined | Hex = undefined,
	// Code is Bytecode encoded with constructor arguments
	TCode extends undefined | Hex = undefined,
	THumanReadableAbi extends readonly string[] = TAbi extends readonly string[]
		? TAbi
		: TAbi extends Abi
			? FormatAbi<TAbi>
			: never,
>({
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
	code,
}: CreateContractParams<TName, TAbi, TAddress, TBytecode, TDeployedBytecode, TCode>) => Contract<
	TName,
	THumanReadableAbi,
	TAddress,
	TBytecode,
	TDeployedBytecode,
	TCode
>
