import type { ByteArray, Hex } from '../../types/misc.js'
import type { TypedDataDefinition } from '../../types/typedData.js'
import type { Address, TypedData } from 'abitype'
export type RecoverTypedDataAddressParameters<
	TTypedData extends
		| TypedData
		| {
				[key: string]: unknown
		  } = TypedData,
	TPrimaryType extends string = string,
> = TypedDataDefinition<TTypedData, TPrimaryType> & {
	signature: Hex | ByteArray
}
export type RecoverTypedDataAddressReturnType = Address
export declare function recoverTypedDataAddress<
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
	signature,
	types,
}: RecoverTypedDataAddressParameters<
	TTypedData,
	TPrimaryType
>): Promise<RecoverTypedDataAddressReturnType>
//# sourceMappingURL=recoverTypedDataAddress.d.ts.map
