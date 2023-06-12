// TODO better type from abi type
type Abi = Array<any>
type Address = `0x${string}`

export type EVMtsContract<
	TName extends string,
	TAddress extends Address | undefined,
	TAbi extends Abi,
> = {
	abi: TAbi
	name: TName
	address: TAddress | undefined
	methods: Array<any>
	events: Array<any>
	// TODO abi type magic
	read: any
	// TODO abi type magic
	write: any
}

export const evmtsContractFactory = <
	TName extends string,
	TAddress extends Address | undefined,
	TAbi extends Abi,
>({
	abi,
	name,
	address,
}: Pick<EVMtsContract<TName, TAddress, TAbi>, 'name' | 'abi' | 'address'>): EVMtsContract<TName, TAddress, TAbi> => {
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
					functionName: method.name,
					args,
					contractAddress: address,
				}
			}
			return [method.name, creator]
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
					functionName: method.name,
					args,
					contractAddress: address,
				}
			}
			return [method.name, creator]
		}),
	)
	return {
		name,
		abi,
		address,
		methods,
		events,
		read,
		write,
	}
}
