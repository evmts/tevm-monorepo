/**
 * A wrapper around {@link import('@ethereumjs/blockchain').Blockchain}
 * TevmBlockchain notably implements a createFromForkUrl method that properly
 * forks a live blockchain.
 */
export class TevmBlockchain extends Blockchain {
    /**
     * Creates a TevmBlockchain instance
     * @override
     * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options]
     * @returns {Promise<TevmBlockchain>}
     */
    static override create: (options?: import("@ethereumjs/blockchain").BlockchainOptions | undefined) => Promise<TevmBlockchain>;
    /**
     * Forks a a given block from rpc url and creates a blockchain
     * @param {object} options - A required options object
     * @param {string} options.url - The url being forked
     * @param {import('viem').BlockTag | bigint | import('viem').Hex} [options.tag] - An optional blockTag to fork
     * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options.blockchainOptions] - Options to pass to the underlying {@link import('@ethereumjs/blockchain').Blockchain} constructor
     */
    static createFromForkUrl: ({ url, tag, blockchainOptions }: {
        url: string;
        tag?: bigint | import("viem").BlockTag | `0x${string}` | undefined;
        blockchainOptions?: import("@ethereumjs/blockchain").BlockchainOptions | undefined;
    }) => Promise<TevmBlockchain>;
    /**
     * @returns {Promise<import('@ethereumjs/block').Block | undefined>}
     */
    getPendingBlock: () => Promise<import('@ethereumjs/block').Block | undefined>;
    /**
     * @param {import('@ethereumjs/block').Block | undefined} block
     * @returns {Promise<void>}
     */
    setPendingBlock: (block: import('@ethereumjs/block').Block | undefined) => Promise<void>;
    /**
     * @param {object} options
     * @param {import('viem').BlockTag | bigint} options.tag
     */
    getBlockByOption: ({ tag }: {
        tag: import('viem').BlockTag | bigint;
    }) => Promise<Block | undefined>;
    #private;
}
import { Blockchain } from '@ethereumjs/blockchain';
import { Block } from '@ethereumjs/block';
//# sourceMappingURL=TevmBlockchain.d.ts.map