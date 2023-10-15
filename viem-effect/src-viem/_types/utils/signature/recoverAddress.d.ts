import type { Address } from 'abitype';
import type { ByteArray, Hex } from '../../types/misc.js';
export type RecoverAddressParameters = {
    hash: Hex | ByteArray;
    signature: Hex | ByteArray;
};
export type RecoverAddressReturnType = Address;
export declare function recoverAddress({ hash, signature, }: RecoverAddressParameters): Promise<RecoverAddressReturnType>;
//# sourceMappingURL=recoverAddress.d.ts.map