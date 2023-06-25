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
} from 'abitype'

export type EVMtsContract<
	TName extends string,
	TAddress extends Address | undefined,
	TAbi extends Abi,
> = {
	abi: TAbi
	name: TName
	address: TAddress
	// TODO Do ABI magic on events too
	events: {
		[TEventName in ExtractAbiEventNames<TAbi>]: <
			TArgs extends AbiParametersToPrimitiveTypes<
				ExtractAbiEvent<TAbi, TEventName>['inputs']
			> &
				AbiEvent[] = AbiParametersToPrimitiveTypes<
				ExtractAbiEvent<TAbi, TEventName>['inputs']
			> &
				AbiEvent[],
		>(
			...args: TArgs
		) => {
			address: TAddress
			abi: [ExtractAbiEvent<TAbi, TEventName>]
			args: TArgs
		}
	}
	read: {
		[TFunctionName in ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>]: <
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
			address: TAddress
			abi: [ExtractAbiFunction<TAbi, TFunctionName>]
			args: TArgs
		}
	}
	write: {
		[TFunctionName in
			ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>]: <
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
			address: TAddress
			abi: [ExtractAbiFunction<TAbi, TFunctionName>]
			args: TArgs
		}
	}
}

export const evmtsContractFactory = <
	TName extends string,
	TAddress extends Address | undefined,
	TAbi extends Abi,
>({
	abi,
	name,
	address,
}: Pick<
	EVMtsContract<TName, TAddress, TAbi>,
	'name' | 'abi' | 'address'
>): EVMtsContract<TName, TAddress, TAbi> => {
	const methods = abi.filter((field: any) => {
		return field.type === 'function'
	})
	const events = abi.filter((field: any) => {
		return field.type === 'event'
	})
	// TODO filter for read
	// TODO ABI type magic
	const write = Object.fromEntries(
		methods.map((method) => {
			// TODO ABI Type
			const creator = (...args: any[]) => {
				return {
					abi: [method],
					functionName: (method as AbiFunction).name,
					args,
					address,
				}
			}
			return [(method as AbiFunction).name, creator]
		}),
	)
	// TODO filter for read
	// TODO ABI type magic
	const read = Object.fromEntries(
		methods.map((method) => {
			// TODO ABI Type
			const creator = (...args: any[]) => {
				return {
					abi: [method],
					functionName: (method as AbiFunction).name,
					args,
					address,
				}
			}
			return [(method as AbiFunction).name, creator]
		}),
	)
	return {
		name,
		abi,
		address,
		events: events as any,
		read: read as any,
		write: write as any,
	}
}
