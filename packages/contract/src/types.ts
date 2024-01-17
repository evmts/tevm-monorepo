import type { Contract } from './Contract.js'
import type { Script } from './Script.js'

export type CreateContractParams<
	TName extends string,
	THumanReadableAbi extends readonly string[],
> = Pick<Contract<TName, THumanReadableAbi>, 'name' | 'humanReadableAbi'>

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

export type CreateScriptParams<
	TName extends string,
	THumanReadableAbi extends readonly string[],
> = Pick<
	Script<TName, THumanReadableAbi>,
	'name' | 'humanReadableAbi' | 'bytecode' | 'deployedBytecode'
>

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
