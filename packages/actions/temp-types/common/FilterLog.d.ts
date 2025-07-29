import type { Hex } from './Hex.js';
/**
 * FilterLog type for eth JSON-RPC procedures
 */
export type FilterLog = {
    readonly address: Hex;
    readonly blockHash: Hex;
    readonly blockNumber: bigint;
    readonly data: Hex;
    readonly logIndex: bigint;
    readonly removed: boolean;
    readonly topics: readonly Hex[];
    readonly transactionHash: Hex;
    readonly transactionIndex: bigint;
};
//# sourceMappingURL=FilterLog.d.ts.map