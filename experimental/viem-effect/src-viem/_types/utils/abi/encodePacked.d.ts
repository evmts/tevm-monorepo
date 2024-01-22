import type { Hex } from '../../types/misc.js'
import type {
	AbiParameterToPrimitiveType,
	AbiType,
	SolidityAddress,
	SolidityArrayWithoutTuple,
	SolidityBool,
	SolidityBytes,
	SolidityInt,
	SolidityString,
} from 'abitype'
type PackedAbiType =
	| SolidityAddress
	| SolidityBool
	| SolidityBytes
	| SolidityInt
	| SolidityString
	| SolidityArrayWithoutTuple
type EncodePackedValues<
	TPackedAbiTypes extends readonly PackedAbiType[] | readonly unknown[],
> = {
	[K in keyof TPackedAbiTypes]: TPackedAbiTypes[K] extends AbiType
		? AbiParameterToPrimitiveType<{
				type: TPackedAbiTypes[K]
		  }>
		: unknown
}
export declare function encodePacked<
	const TPackedAbiTypes extends readonly PackedAbiType[] | readonly unknown[],
>(types: TPackedAbiTypes, values: EncodePackedValues<TPackedAbiTypes>): Hex
export {}
//# sourceMappingURL=encodePacked.d.ts.map
