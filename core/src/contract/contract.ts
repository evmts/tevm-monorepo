import type {
	Abi,
	AbiEvent,
	AbiFunction,
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiEvent,
	ExtractAbiEventNames,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
} from 'abitype'
import { formatAbi } from 'abitype'
import { CreateEventFilterParameters } from 'viem'
import { MaybeExtractEventArgsFromAbi } from 'viem/dist/types/types/contract'
import { ValueOf } from 'viem/dist/types/types/utils'

export type EVMtsContract<
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
	THumanReadableAbi = FormatAbi<TAbi>,
> = {
	abi: TAbi
	humanReadableAbi: THumanReadableAbi
	bytecode: `0x${string}`
	name: TName
	addresses: TAddresses
	events: <TChainId extends keyof TAddresses>(options?: {
		chainId?: TChainId | number | undefined
	}) => {
		[TEventName in ExtractAbiEventNames<TAbi>]: (<
			TStrict extends boolean = false,
		>(
			params: Pick<
				CreateEventFilterParameters<
					ExtractAbiEvent<TAbi, TEventName>,
					TStrict,
					TAbi,
					TEventName,
					MaybeExtractEventArgsFromAbi<TAbi, TEventName>
				>,
				'fromBlock' | 'toBlock' | 'args' | 'strict'
			>,
		) => CreateEventFilterParameters<
			ExtractAbiEvent<TAbi, TEventName>,
			TStrict,
			TAbi,
			TEventName,
			MaybeExtractEventArgsFromAbi<TAbi, TEventName>
		> & { eventName: TEventName; abi: [ExtractAbiEvent<TAbi, TEventName>] }) & {
			address: ValueOf<TAddresses>
			eventName: TEventName
			abi: [ExtractAbiEvent<TAbi, TEventName>]
			humanReadableAbi: FormatAbi<[ExtractAbiEvent<TAbi, TEventName>]>
		}
	}
	read: <TChainId extends keyof TAddresses>(options?: {
		chainId?: TChainId | number | undefined
	}) => {
		[TFunctionName in ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>]: (<
			TArgs extends AbiParametersToPrimitiveTypes<
				ExtractAbiFunction<TAbi, TFunctionName>['inputs']
			> &
				any[] = AbiParametersToPrimitiveTypes<
				ExtractAbiFunction<TAbi, TFunctionName>['inputs']
			> &
				any[],
		>(
			...args: TArgs
		) => {
			address: ValueOf<TAddresses>
			abi: [ExtractAbiFunction<TAbi, TFunctionName>]
			humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
			args: TArgs['length'] extends 0 ? undefined : TArgs
			functionName: TFunctionName
		}) & {
			address: ValueOf<TAddresses>
			abi: [ExtractAbiFunction<TAbi, TFunctionName>]
			humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
			functionName: TFunctionName
		}
	}
	write: <TChainId extends keyof TAddresses>(options?: {
		chainId?: TChainId | number | undefined
	}) => {
		[TFunctionName in
			ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>]: (<
			TArgs extends AbiParametersToPrimitiveTypes<
				ExtractAbiFunction<TAbi, TFunctionName>['inputs']
			> &
				any[] = AbiParametersToPrimitiveTypes<
				ExtractAbiFunction<TAbi, TFunctionName>['inputs']
			> &
				any[],
		>(
			...args: TArgs
		) => {
			address: ValueOf<TAddresses>
			abi: [ExtractAbiFunction<TAbi, TFunctionName>]
			humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
			args: TArgs['length'] extends 0 ? undefined : TArgs
			functionName: TFunctionName
		}) & {
			address: ValueOf<TAddresses>
			abi: [ExtractAbiFunction<TAbi, TFunctionName>]
			humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
			functionName: TFunctionName
		}
	}
}

export const evmtsContractFactory = <
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
>({
	abi,
	name,
	addresses,
	bytecode,
}: Pick<
	EVMtsContract<TName, TAddresses, TAbi>,
	'name' | 'abi' | 'addresses' | 'bytecode'
>): EVMtsContract<TName, TAddresses, TAbi> => {
	const methods = abi.filter((field) => {
		return field.type === 'function'
	})
	const events = <TChainId extends keyof TAddresses>({
		chainId,
	}: { chainId?: TChainId | number | undefined } = {}) =>
		Object.fromEntries(
			abi
				.filter((field) => {
					return field.type === 'event'
				})
				.map((eventAbi) => {
					const creator = (params: any) => {
						return {
							eventName: (eventAbi as AbiEvent).name,
							abi: [eventAbi],
							humanReadableAbi: formatAbi([eventAbi]),
							address: chainId
								? addresses[chainId as number]
								: Object.values(addresses)[0],
							...params,
						}
					}
					creator.address = chainId
						? addresses[chainId as number]
						: Object.values(addresses)[0]
					creator.abi = [eventAbi]
					creator.eventName = (eventAbi as AbiEvent).name
					creator.humanReadableAbi = formatAbi([eventAbi])
					return [(eventAbi as AbiEvent).name, creator]
				}),
		)
	// we extend keyof TAddresses instead of number to make the types strict and safe
	// this will force user to often cast the chain id which may be annoying
	// with feedback we may want to change this
	const write = <TChainId extends keyof TAddresses & number>({
		chainId,
	}: { chainId?: TChainId | number | undefined } = {}) =>
		Object.fromEntries(
			methods.map((method) => {
				const creator = (...args: any[]) => {
					// need to handle case where there is an overload
					// TODO make this more efficient
					const methodAbi = methods.filter(
						(m) => (m as AbiFunction).name === (method as AbiFunction)?.name,
					)
					return {
						abi: methodAbi,
						humanReadableAbi: formatAbi([method]),
						functionName: (method as AbiFunction).name,
						args: args.length > 0 ? args : undefined,
						// TODO we are currently defaulting to the first address in the case of no chain id
						// There has to be a better way like providing an explicit default property in the address config
						address:
							addresses[chainId as number] ??
							(Object.values(
								addresses,
							)[0] as unknown as TChainId extends unknown
								? ValueOf<TAddresses>
								: TAddresses[TChainId]) ??
							undefined,
					}
				}
				creator.address = addresses[chainId as number] ?? undefined
				creator.abi = [method]
				creator.humanReadableAbi = formatAbi([method])
				return [(method as AbiFunction).name, creator]
			}),
		)
	// TODO filter for read
	// TODO ABI type magic
	const read = <TChainId extends keyof TAddresses & number>({
		chainId,
	}: { chainId?: TChainId | number | undefined } = {}) =>
		Object.fromEntries(
			methods.map((method) => {
				// TODO ABI Type
				const creator = (...args: any[]) => {
					// need to handle case where there is an overload
					// TODO make this more efficient
					const methodAbi = methods.filter(
						(m) => (m as AbiFunction).name === (method as AbiFunction)?.name,
					)
					return {
						abi: methodAbi,
						humanReadableAbi: formatAbi([method]),
						functionName: (method as AbiFunction).name,
						args: args.length > 0 ? args : undefined,
						// TODO we are currently defaulting to the first address in the case of no chain id
						// There has to be a better way like providing an explicit default property in the address config
						address:
							addresses[chainId as number] ??
							(Object.values(
								addresses,
							)[0] as unknown as TChainId extends unknown
								? ValueOf<TAddresses>
								: TAddresses[TChainId]) ??
							undefined,
					}
				}
				creator.address = addresses[chainId as number] ?? undefined
				creator.abi = [method]
				creator.humanReadableAbi = formatAbi([method])
				return [(method as AbiFunction).name, creator]
			}),
		)
	return {
		name,
		abi,
		humanReadableAbi: formatAbi(abi),
		addresses,
		bytecode,
		events: events as any,
		write: write as any,
		read: read as any,
	}
}
