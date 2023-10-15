import type { AbiParameter } from 'abitype';
import type { AbiItem } from '../../types/contract.js';
export declare function formatAbiItem(abiItem: AbiItem, { includeName }?: {
    includeName?: boolean;
}): string;
export declare function formatAbiParams(params: readonly AbiParameter[] | undefined, { includeName }?: {
    includeName?: boolean;
}): string;
//# sourceMappingURL=formatAbiItem.d.ts.map