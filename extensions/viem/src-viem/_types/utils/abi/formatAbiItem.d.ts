import type { AbiItem } from '../../types/contract.js'
import type { AbiParameter } from 'abitype'
export declare function formatAbiItem(
	abiItem: AbiItem,
	{
		includeName,
	}?: {
		includeName?: boolean
	},
): string
export declare function formatAbiParams(
	params: readonly AbiParameter[] | undefined,
	{
		includeName,
	}?: {
		includeName?: boolean
	},
): string
//# sourceMappingURL=formatAbiItem.d.ts.map
