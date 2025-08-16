import type { Hex } from './Hex.js';
import type { TransactionParams } from './TransactionParams.js';
/**
 * The type returned by block related
 * json rpc procedures
 */
export type BlockResult<TIncludeTransactions extends boolean = false> = {
    /**
     * The block number (height) in the blockchain.
     */
    readonly number: Hex;
    /**
     * The hex stringhash of the block.
     */
    readonly hash: Hex;
    /**
     * The hex stringhash of the parent block.
     */
    readonly parentHash: Hex;
    readonly nonce: Hex;
    /**
     * The hex stringhash of the uncles of the block.
     */
    readonly sha3Uncles: Hex;
    readonly logsBloom: Hex;
    readonly transactionsRoot: Hex;
    readonly stateRoot: Hex;
    readonly miner: Hex;
    readonly difficulty: Hex;
    readonly totalDifficulty: Hex;
    readonly extraData: Hex;
    readonly size: Hex;
    readonly gasLimit: Hex;
    readonly gasUsed: Hex;
    readonly timestamp: Hex;
    readonly transactions: TIncludeTransactions extends true ? Array<TransactionParams> : Hex[];
    readonly uncles: Hex[];
};
//# sourceMappingURL=BlockResult.d.ts.map