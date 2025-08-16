import type { Address } from '@tevm/utils';
import type { Hex } from '@tevm/utils';
import type { BaseParams } from '../common/BaseParams.js';
/**
 * Tevm params to set an account in the vm state
 * all fields are optional except address
 * @example
 * const accountParams: import('tevm/api').SetAccountParams = {
 *   account: '0x...',
 *   nonce: 5n,
 *   balance: 9000000000000n,
 *   storageRoot: '0x....',
 *   deployedBytecode: '0x....'
 * }
 */
export type SetAccountParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
    /**
     * Address of account
     */
    readonly address: Address;
    /**
     * Nonce to set account to
     */
    readonly nonce?: bigint;
    /**
     * Balance to set account to
     */
    readonly balance?: bigint;
    /**
     * Contract bytecode to set account to
     */
    readonly deployedBytecode?: Hex;
    /**
     * Storage root to set account to
     */
    readonly storageRoot?: Hex;
    /**
     * key-value mapping to override all slots in the account storage before executing the calls
     */
    readonly state?: Record<Hex, Hex>;
    /**
     * key-value mapping to override individual slots in the account storage before executing the calls
     */
    readonly stateDiff?: Record<Hex, Hex>;
};
//# sourceMappingURL=SetAccountParams.d.ts.map