import type { Abi, Address, FormatAbi, Hex, ParseAbi } from '@tevm/utils'
import type { Contract } from './Contract.js'

/**
 * Parameters for creating a {@link Contract} instance.
 * This type allows for two mutually exclusive ways of specifying the ABI:
 * either as a human-readable ABI or as a JSON ABI.
 *
 * @typeParam TName - The name of the contract (optional)
 * @typeParam TAbi - The ABI type (either string[] for human readable or Abi for JSON)
 * @typeParam TAddress - The contract address type (optional)
 * @typeParam TBytecode - The contract creation bytecode type (optional)
 * @typeParam TDeployedBytecode - The deployed bytecode type (optional)
 * @typeParam TCode - The runtime bytecode type (optional)
 *
 * @see {@link CreateContract}
 *
 * @example
 * Using human-readable ABI:
 * ```typescript
 * const params: CreateContractParams = {
 *   name: 'ERC20',
 *   humanReadableAbi: [
 *     'function balanceOf(address owner) view returns (uint256)',
 *     'function transfer(address to, uint256 amount) returns (bool)',
 *   ],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
 * }
 * ```
 *
 * @example
 * Using JSON ABI:
 * ```typescript
 * const params: CreateContractParams = {
 *   name: 'ERC20',
 *   abi: [
 *     {
 *       "inputs": [{"name": "owner", "type": "address"}],
 *       "name": "balanceOf",
 *       "outputs": [{"type": "uint256"}],
 *       "stateMutability": "view",
 *       "type": "function"
 *     },
 *   ],
 *   address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
 * }
 * ```
 */
export type CreateContractParams<
	TName extends string | undefined | never,
	TAbi extends readonly string[] | Abi,
	TAddress extends undefined | Address | never,
	TBytecode extends undefined | Hex | never,
	TDeployedBytecode extends undefined | Hex | never,
	TCode extends undefined | Hex | never,
> =
	| {
			/** Optional name of the contract */
			name?: TName
			/** Human-readable ABI of the contract */
			humanReadableAbi: TAbi extends readonly string[] ? TAbi : FormatAbi<TAbi>
			abi?: never
			/** Optional address of the deployed contract */
			address?: TAddress
			/** Optional creation bytecode of the contract */
			bytecode?: TBytecode
			/** Optional deployed bytecode of the contract */
			deployedBytecode?: TDeployedBytecode
			/** Optional runtime bytecode of the contract */
			code?: TCode
	  }
	| {
			/** Optional name of the contract */
			name?: TName
			humanReadableAbi?: never
			/** JSON ABI of the contract */
			abi: TAbi extends readonly string[] ? ParseAbi<TAbi> : TAbi extends Abi ? TAbi : never
			/** Optional address of the deployed contract */
			address?: TAddress
			/** Optional creation bytecode of the contract */
			bytecode?: TBytecode
			/** Optional deployed bytecode of the contract */
			deployedBytecode?: TDeployedBytecode
			/** Optional runtime bytecode of the contract */
			code?: TCode
	  }
