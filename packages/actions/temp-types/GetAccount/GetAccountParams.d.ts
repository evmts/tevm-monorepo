import type { BaseParams } from '../common/BaseParams.js';
import type { Address, BlockParam } from '../common/index.js';
/**
 * Tevm params to get an account
 * @example
 * const getAccountParams: import('@tevm/api').GetAccountParams = {
 *   address: '0x...',
 * }
 */
export type GetAccountParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
    /**
     * Address of account
     */
    readonly address: Address;
    /**
     * If true the handler will return the contract storage
     * It only returns storage that happens to be cached in the vm
     * In fork mode if storage hasn't yet been cached it will not be returned
     * This defaults to false
     * Be aware that this can be very expensive if a contract has a lot of storage
     */
    readonly returnStorage?: boolean;
    /**
     * Block tag to fetch account from
     * - bigint for block number
     * - hex string for block hash
     * - 'latest', 'earliest', 'pending', 'forked' etc. tags
     */
    readonly blockTag?: BlockParam;
};
//# sourceMappingURL=GetAccountParams.d.ts.map