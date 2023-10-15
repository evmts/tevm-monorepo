import { secp256k1 } from '@noble/curves/secp256k1';
import { hexToBigInt } from '../../utils/encoding/fromHex.js';
import { toHex } from '../../utils/encoding/toHex.js';
/**
 * @description Converts a signature into hex format.
 *
 * @param signature The signature to convert.
 * @returns The signature in hex format.
 *
 * @example
 * signatureToHex({
 *   r: '0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf',
 *   s: '0x4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db8',
 *   v: 28n
 * })
 * // "0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c"
 */
export function signatureToHex({ r, s, v }) {
    return `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${toHex(v).slice(2)}`;
}
//# sourceMappingURL=signatureToHex.js.map