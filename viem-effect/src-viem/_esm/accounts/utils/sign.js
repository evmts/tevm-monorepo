import { secp256k1 } from '@noble/curves/secp256k1';
import { toHex } from '../../utils/encoding/toHex.js';
/**
 * @description Signs a hash with a given private key.
 *
 * @param hash The hash to sign.
 * @param privateKey The private key to sign with.
 *
 * @returns The signature.
 */
export async function sign({ hash, privateKey, }) {
    const { r, s, recovery } = secp256k1.sign(hash.slice(2), privateKey.slice(2));
    return {
        r: toHex(r),
        s: toHex(s),
        v: recovery ? 28n : 27n,
    };
}
//# sourceMappingURL=sign.js.map