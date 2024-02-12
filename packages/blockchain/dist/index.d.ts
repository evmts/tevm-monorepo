import * as _ethereumjs_block from '@ethereumjs/block';
import { Block } from '@ethereumjs/block';
import * as viem from 'viem';
import * as _ethereumjs_blockchain from '@ethereumjs/blockchain';
import { Blockchain } from '@ethereumjs/blockchain';

/**
 * A wrapper around {@link import('@ethereumjs/blockchain').Blockchain}
 * TevmBlockchain notably implements a createFromForkUrl method that properly
 * forks a live blockchain.
 */
declare class TevmBlockchain extends Blockchain {
    /**
     * Creates a TevmBlockchain instance
     * @override
     * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options]
     * @returns {Promise<TevmBlockchain>}
     */
    static override create: (options?: _ethereumjs_blockchain.BlockchainOptions | undefined) => Promise<TevmBlockchain>;
    /**
     * Forks a a given block from rpc url and creates a blockchain
     * @param {object} options - A required options object
     * @param {string} options.url - The url being forked
     * @param {import('viem').BlockTag | bigint | import('viem').Hex} [options.tag] - An optional blockTag to fork
     * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options.blockchainOptions] - Options to pass to the underlying {@link import('@ethereumjs/blockchain').Blockchain} constructor
     */
    static createFromForkUrl: ({ url, tag, blockchainOptions }: {
        url: string;
        tag?: bigint | viem.BlockTag | `0x${string}` | undefined;
        blockchainOptions?: _ethereumjs_blockchain.BlockchainOptions | undefined;
    }) => Promise<TevmBlockchain>;
    /**
     * @returns {Promise<import('@ethereumjs/block').Block | undefined>}
     */
    getPendingBlock: () => Promise<_ethereumjs_block.Block | undefined>;
    /**
     * @param {import('@ethereumjs/block').Block | undefined} block
     * @returns {Promise<void>}
     */
    setPendingBlock: (block: _ethereumjs_block.Block | undefined) => Promise<void>;
    /**
     * @param {object} options
     * @param {import('viem').BlockTag | bigint} options.tag
     */
    getBlockByOption: ({ tag }: {
        tag: viem.BlockTag | bigint;
    }) => Promise<Block | undefined>;
    #private;
}

export { TevmBlockchain };
