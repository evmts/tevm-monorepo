/**
 * Ethereum hex string type (0x prefixed)
 */
export type Hex = `0x${string}`;
/**
 * Block tag type for specifying blocks
 */
export type BlockTag = "latest" | "earliest" | "pending" | "safe" | "finalized" | "forked";
/**
 * Block identifier type - can be a number, bigint, Uint8Array hash, or hex string
 */
export type BlockId = number | bigint | Uint8Array | Hex | BlockTag;
/**
 * Blockchain shape interface for Effect-based blockchain operations.
 *
 * This interface provides Effect-wrapped methods for interacting with the
 * blockchain, including block retrieval, storage, and validation.
 */
export type BlockchainShape = {
    /**
     * - The underlying Chain instance
     */
    chain: import("@tevm/blockchain").Chain;
    /**
     * - Get a block by its ID (number, hash, or tag)
     */
    getBlock: (blockId: BlockId) => import("effect").Effect.Effect<import("@tevm/block").Block, import("@tevm/errors-effect").BlockNotFoundError>;
    /**
     * - Get a block by its hash
     */
    getBlockByHash: (hash: Hex) => import("effect").Effect.Effect<import("@tevm/block").Block, import("@tevm/errors-effect").BlockNotFoundError>;
    /**
     * - Add a block to the blockchain
     */
    putBlock: (block: import("@tevm/block").Block) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").InvalidBlockError>;
    /**
     * - Get the latest block in the canonical chain
     */
    getCanonicalHeadBlock: () => import("effect").Effect.Effect<import("@tevm/block").Block, import("@tevm/errors-effect").BlockNotFoundError>;
    /**
     * - Get the current iterator head block
     */
    getIteratorHead: (name?: string) => import("effect").Effect.Effect<import("@tevm/block").Block, import("@tevm/errors-effect").BlockNotFoundError>;
    /**
     * - Set the iterator head position
     */
    setIteratorHead: (tag: string, headHash: Uint8Array) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").InvalidBlockError>;
    /**
     * - Delete a block from the blockchain
     */
    delBlock: (blockHash: Uint8Array) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").BlockNotFoundError>;
    /**
     * - Validate a block header
     */
    validateHeader: (header: import("@tevm/block").BlockHeader, height?: bigint) => import("effect").Effect.Effect<void, import("@tevm/errors-effect").InvalidBlockError>;
    /**
     * - Create a deep copy of the blockchain
     */
    deepCopy: () => import("effect").Effect.Effect<BlockchainShape, import("@tevm/errors-effect").InvalidBlockError>;
    /**
     * - Create a shallow copy of the blockchain
     */
    shallowCopy: () => BlockchainShape;
    /**
     * - Effect that completes when the blockchain is ready
     */
    ready: import("effect").Effect.Effect<void, import("@tevm/errors-effect").InvalidBlockError>;
    /**
     * - Iterate through blocks in a range from start to end (inclusive)
     */
    iterator: (start: bigint, end: bigint) => AsyncIterable<import("@tevm/block").Block>;
};
/**
 * Configuration options for BlockchainLive layer
 */
export type BlockchainLiveOptions = {
    /**
     * - Optional Common instance (auto-detected from CommonService if not provided)
     */
    common?: import("@tevm/common").Common;
    /**
     * - Optional genesis block override
     */
    genesisBlock?: import("@tevm/block").Block;
    /**
     * - Optional genesis state root override
     */
    genesisStateRoot?: Uint8Array;
};
/**
 * Configuration options for BlockchainLocal layer
 */
export type BlockchainLocalOptions = {
    /**
     * - Optional genesis block override
     */
    genesisBlock?: import("@tevm/block").Block;
    /**
     * - Optional genesis state root override
     */
    genesisStateRoot?: Uint8Array;
};
//# sourceMappingURL=types.d.ts.map