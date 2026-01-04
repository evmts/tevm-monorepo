import type { Address, EncodeDeployDataParameters, Hex, ParseAbi } from '@tevm/utils'
import type { EventActionCreator } from './event/EventActionCreator.js'
import type { ReadActionCreator } from './read/ReadActionCreator.js'
import type { WriteActionCreator } from './write/WriteActionCreator.js'

/**
 * Represents a specific contract with its ABI and optional bytecode.
 * Contracts provide type-safe interfaces for interacting with smart contracts,
 * including read and write methods, event filtering, and deployment.
 *
 * @template TName - The name of the contract
 * @template THumanReadableAbi - The human-readable ABI of the contract
 * @template TAddress - The address of the contract (optional)
 * @template TBytecode - The creation bytecode of the contract (optional)
 * @template TDeployedBytecode - The deployed bytecode of the contract (optional)
 * @template TCode - The runtime bytecode of the contract (optional)
 *
 * @example
 * Creating and using a Contract instance:
 * ```typescript
 * import { createContract } from 'tevm/contract'
 *
 * const MyContract = createContract({
 *   name: 'MyToken',
 *   humanReadableAbi: [
 *     'function balanceOf(address account) view returns (uint256)',
 *     'function transfer(address to, uint256 amount) returns (bool)',
 *     'event Transfer(address indexed from, address indexed to, uint256 value)'
 *   ],
 *   address: '0x1234567890123456789012345678901234567890'
 * })
 *
 * // Read contract state
 * const balanceAction = MyContract.read.balanceOf('0xabcdef...')
 * const balance = await tevm.contract(balanceAction)
 *
 * // Write to contract
 * const transferAction = MyContract.write.transfer('0xfedcba...', 1000n)
 * const result = await tevm.contract(transferAction)
 *
 * // Create event filter
 * const transferFilter = MyContract.events.Transfer({ fromBlock: 'latest' })
 * const logs = await tevm.eth.getLogs(transferFilter)
 * ```
 *
 * @example
 * Using with a memory client:
 * ```typescript
 * import { createMemoryClient } from 'tevm'
 *
 * const client = createMemoryClient()
 *
 * const balance = await client.readContract(
 *   MyContract.read.balanceOf('0xabcdef...')
 * )
 * ```
 */
export type Contract<
	TName extends string,
	THumanReadableAbi extends ReadonlyArray<string>,
	TAddress extends undefined | Address = undefined,
	TBytecode extends undefined | Hex = undefined,
	TDeployedBytecode extends undefined | Hex = undefined,
	TCode extends undefined | Hex = undefined,
> = {
	/**
	 * The configured address of the contract. If not set, it will be undefined.
	 * Use the `withAddress` method to set or change the address.
	 */
	address: TAddress

	/**
	 * The JSON ABI of the contract.
	 * @example
	 * ```typescript
	 * console.log(MyContract.abi)
	 * // [{name: 'balanceOf', inputs: [...], outputs: [...], ...}]
	 * ```
	 */
	abi: ParseAbi<THumanReadableAbi>

	/**
	 * The runtime bytecode of the contract, encoded with constructor arguments.
	 */
	code: TCode

	/**
	 * The creation bytecode of the contract.
	 */
	bytecode: TBytecode

	/**
	 * The deployed bytecode of the contract.
	 */
	deployedBytecode: TDeployedBytecode

	/**
	 * The human-readable ABI of the contract.
	 * @example
	 * ```typescript
	 * console.log(MyContract.humanReadableAbi)
	 * // ['function balanceOf(address): uint256', ...]
	 * ```
	 */
	humanReadableAbi: THumanReadableAbi

	/**
	 * The name of the contract. If imported, this will match the name of the contract import.
	 */
	name?: TName

	/**
	 * Action creators for events. Used to create event filters in a type-safe way.
	 * @example
	 * ```typescript
	 * const transferFilter = MyContract.events.Transfer({ from: '0x1234...' })
	 * const logs = await tevm.eth.getLogs(transferFilter)
	 * ```
	 */
	events: EventActionCreator<THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode>

	/**
	 * Action creators for contract view and pure functions.
	 * @example
	 * ```typescript
	 * const balanceAction = MyContract.read.balanceOf('0x1234...')
	 * const balance = await tevm.contract(balanceAction)
	 * ```
	 */
	read: ReadActionCreator<THumanReadableAbi, TAddress, TCode>

	/**
	 * Action creators for contract payable and nonpayable functions.
	 * @example
	 * ```typescript
	 * const transferAction = MyContract.write.transfer('0x5678...', 1000n)
	 * const result = await tevm.contract(transferAction)
	 * ```
	 */
	write: WriteActionCreator<THumanReadableAbi, TAddress, TCode>

	/**
	 * Action creator for deploying the contract.
	 * @example
	 * ```typescript
	 * const deployAction = MyContract.deploy('Constructor', 'Args')
	 * const deployedContract = await tevm.contract(deployAction)
	 * ```
	 */
	deploy: (
		...args: EncodeDeployDataParameters<ParseAbi<THumanReadableAbi>> extends { args: infer TArgs }
			? TArgs extends ReadonlyArray<any>
				? TArgs
				: []
			: []
	) => EncodeDeployDataParameters<ParseAbi<THumanReadableAbi>>

	/**
	 * Adds an address to the contract. All action creators will include
	 * the address property if added. This method returns a new contract;
	 * it does not modify the existing contract.
	 * @example
	 * ```typescript
	 * const MyContractWithAddress = MyContract.withAddress('0x1234...')
	 * ```
	 */
	withAddress: <TNewAddress extends Address>(
		address: TNewAddress,
	) => Contract<TName, THumanReadableAbi, TNewAddress, TBytecode, TDeployedBytecode, TCode>

	/**
	 * Updates the bytecode of the contract.
	 * Returns a new contract instance with the updated code.
	 * @param {Hex} encodedBytecode - The encoded bytecode of the contract
	 * @returns {Contract} A new contract instance with updated code
	 * @example
	 * ```typescript
	 * import { createMemoryClient } from 'tevm'
	 *
	 * const client = createMemoryClient()
	 *
	 * const ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
	 * const UpdatedContract = Contract.withCode('0x60806040...')
	 * const {data, abi, code, args} = UpdatedContract.read.balanceOf('0x1234567890123456789012345678901234567890')
	 * const balance = await client.call({
	 *   to: ADDRESS,
	 *   data,
	 *   abi,
	 *   code,
	 *   args
	 * })
	 * ```
	 */
	withCode: (encodedBytecode: Hex) => Contract<TName, THumanReadableAbi, TAddress, TBytecode, TDeployedBytecode, Hex>
}
