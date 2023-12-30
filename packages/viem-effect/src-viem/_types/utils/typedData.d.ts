import type { Hex } from '../types/misc.js'
import type { TypedDataDefinition } from '../types/typedData.js'
import type { TypedData, TypedDataDomain, TypedDataParameter } from 'abitype'
export declare function validateTypedData<
	const TTypedData extends
		| TypedData
		| {
				[key: string]: unknown
		  },
	TPrimaryType extends string = string,
>({
	domain,
	message,
	primaryType,
	types: types_,
}: TypedDataDefinition<TTypedData, TPrimaryType>): void
export declare function getTypesForEIP712Domain({
	domain,
}: {
	domain?: TypedDataDomain
}): TypedDataParameter[]
export declare function domainSeparator({
	domain,
}: {
	domain: TypedDataDomain
}): Hex
//# sourceMappingURL=typedData.d.ts.map
