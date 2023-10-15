import type { ByteArray, Hex } from '../../types/misc.js';
type TrimOptions = {
    dir?: 'left' | 'right';
};
export type TrimReturnType<TValue extends ByteArray | Hex> = TValue extends Hex ? Hex : ByteArray;
export declare function trim<TValue extends ByteArray | Hex>(hexOrBytes: TValue, { dir }?: TrimOptions): TrimReturnType<TValue>;
export {};
//# sourceMappingURL=trim.d.ts.map