import type { Hex, Signature } from '../../types/misc.js';
export type SignParameters = {
    hash: Hex;
    privateKey: Hex;
};
export type SignReturnType = Signature;
/**
 * @description Signs a hash with a given private key.
 *
 * @param hash The hash to sign.
 * @param privateKey The private key to sign with.
 *
 * @returns The signature.
 */
export declare function sign({ hash, privateKey, }: SignParameters): Promise<SignReturnType>;
//# sourceMappingURL=sign.d.ts.map