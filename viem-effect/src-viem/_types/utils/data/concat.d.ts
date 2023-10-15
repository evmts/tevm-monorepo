import type { ByteArray, Hex } from '../../types/misc.js';
export type ConcatReturnType<TValue extends Hex | ByteArray> = TValue extends Hex ? Hex : ByteArray;
export declare function concat<TValue extends Hex | ByteArray>(values: TValue[]): ConcatReturnType<TValue>;
export declare function concatBytes(values: ByteArray[]): ByteArray;
export declare function concatHex(values: Hex[]): Hex;
//# sourceMappingURL=concat.d.ts.map