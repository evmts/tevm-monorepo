import type { Address } from '@tevm/utils';
/**
 * The fields of this optional object customize the block as part of which the call is simulated. The object contains the following fields:
 * This option cannot be used when `createTransaction` is set to `true`
 * Setting the block number to past block will not run in the context of that blocks state. To do that fork that block number first.
 */
export type BlockOverrideSet = {
    /**
     * Fake block number
     */
    number?: bigint;
    /**
     * Fake difficulty. Note post-merge difficulty should be 0.
     * not included as an option atm
     */
    /**
     * Fake block timestamp
     */
    time?: bigint;
    /**
     * Block gas capacity
     */
    gasLimit?: bigint;
    /**
     * Block fee recipient
     */
    coinbase?: Address;
    /**
     * Fake PrevRandao value
     * Not included as an option atm
     */
    /**
     * Block base fee (see EIP-1559)
     */
    baseFee?: bigint;
    /**
     * Block blob base fee (see EIP-4844)
     */
    blobBaseFee?: bigint;
};
//# sourceMappingURL=BlockOverrideSet.d.ts.map