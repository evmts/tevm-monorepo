import type { HDKey } from '@scure/bip32';
import type { HDAccount, HDOptions } from './types.js';
/**
 * @description Creates an Account from a HD Key.
 *
 * @returns A HD Account.
 */
export declare function hdKeyToAccount(hdKey_: HDKey, { accountIndex, addressIndex, changeIndex, path }?: HDOptions): HDAccount;
//# sourceMappingURL=hdKeyToAccount.d.ts.map