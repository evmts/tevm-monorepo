import type { Contract } from './Contract.js'
import type { Script } from './Script.js'

/**
 * Params for creating a {@link Contract} instance
 * @see {@link CreateContract}
 */
export type CreateContractParams<
	TName extends string,
	THumanReadableAbi extends readonly string[],
> = Pick<Contract<TName, THumanReadableAbi>, 'name' | 'humanReadableAbi'>

/**
 * Type of `createContract` factory function
 * Creates a tevm Contract instance from human readable abi
 * @example
 * ```typescript
 * import { type Contract, createContract} from 'tevm/contract'
 *
 * const contract: Contract = createContract({
 *   name: 'MyContract',
 *  	abi: [
 *  		...
 *  	],
 * })
 * ```
 *
 * To use a json abi first pass it into `formatAbi` to turn it into human readable
 * @example
 * ```typescript
 * import { type Contract, createContract} from 'tevm/contract'
 *
 * const contract = createContract({
 *   name: 'MyContract',
 *  	abi: [
 *  		...
 *  	],
 * })
 * ```
 */
export type CreateContract = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
>({
	name,
	humanReadableAbi,
}: CreateContractParams<TName, THumanReadableAbi>) => Contract<
	TName,
	THumanReadableAbi
>

/**
 * Params for creating a {@link Script} instance
 * @see {@link CreateScript}
 */
export type CreateScriptParams<
	TName extends string,
	THumanReadableAbi extends readonly string[],
> = Pick<
	Script<TName, THumanReadableAbi>,
	'name' | 'humanReadableAbi' | 'bytecode' | 'deployedBytecode'
>

/**
 * Type of `createScript` factory function
 * Creates a tevm Script instance from human readable abi
 * @example
 * ```typescript
 * import { type Script, createScript} from 'tevm/contract'
 *
 * const script: Script = createScript({
 *   name: 'MyScript',
 *   humanReadableAbi: ['function exampleRead(): uint256', ...],
 *   bytecode: '0x123...',
 *   deployedBytecode: '0x123...',
 * })
 * ```
 *
 * To use a json abi first pass it into `formatAbi` to turn it into human readable
 * @example
 * ```typescript
 * import { type Script, createScript, formatAbi} from 'tevm/contract'
 * import { formatAbi } from 'tevm/abi'
 *
 * const script = createScript({
 *  name: 'MyScript',
 *  bytecode: '0x123...',
 *  deployedBytecode: '0x123...',
 *  humanReadableAbi: formatAbi([
 *   {
 *     name: 'balanceOf',
 *     inputs: [
 *     {
 *     name: 'owner',
 *     type: 'address',
 *     },
 *     ],
 *     outputs: [
 *     {
 *     name: 'balance',
 *     type: 'uint256',
 *     },
 *   }
 *   ]),
 *  })
 */
export type CreateScript = <
	TName extends string,
	THumanReadableAbi extends readonly string[],
>({
	name,
	humanReadableAbi,
	bytecode,
	deployedBytecode,
}: CreateScriptParams<TName, THumanReadableAbi>) => Script<
	TName,
	THumanReadableAbi
>
