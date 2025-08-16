import type { BaseParams } from '../common/BaseParams.js';
import type { BlockParam } from '../common/BlockParam.js';
export type DumpStateParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
    /**
     * Block tag to fetch account from
     * - bigint for block number
     * - hex string for block hash
     * - 'latest', 'earliest', 'pending', 'forked' etc. tags
     */
    readonly blockTag?: BlockParam;
};
//# sourceMappingURL=DumpStateParams.d.ts.map