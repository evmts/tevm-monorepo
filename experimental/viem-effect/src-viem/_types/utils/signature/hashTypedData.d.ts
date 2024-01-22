import type { Hex } from '../../types/misc.js'
import type { TypedDataDefinition } from '../../types/typedData.js'
import type { TypedData, TypedDataDomain } from 'abitype'
type MessageTypeProperty = {
	name: string
	type: string
}
export type HashTypedDataParameters<
	TTypedData extends
		| TypedData
		| {
				[key: string]: unknown
		  } = TypedData,
	TPrimaryType extends string = string,
> = TypedDataDefinition<TTypedData, TPrimaryType>
export type HashTypedDataReturnType = Hex
export declare function hashTypedData<
	const TTypedData extends
		| TypedData
		| {
				[key: string]: unknown
		  },
	TPrimaryType extends string = string,
>({
	domain: domain_,
	message,
	primaryType,
	types: types_,
}: HashTypedDataParameters<TTypedData, TPrimaryType>): HashTypedDataReturnType
export declare function hashDomain({
	domain,
	types,
}: {
	domain: TypedDataDomain
	types: Record<string, MessageTypeProperty[]>
}): `0x${string}`
export {}
//# sourceMappingURL=hashTypedData.d.ts.map
