import type { ByteArray, Hex } from '../../types/misc.js';
type PadOptions = {
    dir?: 'left' | 'right';
    size?: number | null;
};
export type PadReturnType<TValue extends ByteArray | Hex> = TValue extends Hex ? Hex : ByteArray;
export declare function pad<TValue extends ByteArray | Hex>(hexOrBytes: TValue, { dir, size }?: PadOptions): PadReturnType<TValue>;
export declare function padHex(hex_: Hex, { dir, size }?: PadOptions): `0x${string}`;
export declare function padBytes(bytes: ByteArray, { dir, size }?: PadOptions): Uint8Array;
export {};
//# sourceMappingURL=pad.d.ts.map