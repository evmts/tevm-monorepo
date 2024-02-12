import { Block } from '@ethereumjs/block';
import { Blockchain } from '@ethereumjs/blockchain';
import { createJsonRpcFetcher } from '@tevm/jsonrpc';
import { numberToHex, hexToNumber } from 'viem';

// src/txType.js
var txType = {
  Legacy: 0,
  AccessListEIP2930: 1,
  FeeMarketEIP1559: 2,
  BlobEIP4844: 3
};
var TevmBlockchain = class _TevmBlockchain extends Blockchain {
  /**
   * Creates a TevmBlockchain instance
   * @override
   * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options]
   * @returns {Promise<TevmBlockchain>}
   */
  static create = async (options) => {
    const blockchain = new _TevmBlockchain(options);
    await /** @type any*/
    blockchain._init(options);
    return blockchain;
  };
  /**
   * Forks a a given block from rpc url and creates a blockchain
   * @param {object} options - A required options object
   * @param {string} options.url - The url being forked
   * @param {import('viem').BlockTag | bigint | import('viem').Hex} [options.tag] - An optional blockTag to fork
   * @param {import('@ethereumjs/blockchain').BlockchainOptions} [options.blockchainOptions] - Options to pass to the underlying {@link import('@ethereumjs/blockchain').Blockchain} constructor
   */
  static createFromForkUrl = async ({ url, tag, blockchainOptions }) => {
    let blockResponse;
    if (typeof tag === "string" && tag.startsWith("0x") && tag.length === 66) {
      blockResponse = /** @type any*/
      await createJsonRpcFetcher(url).request({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByHash",
        params: [tag, true]
      });
    } else if (typeof tag === "bigint") {
      blockResponse = /** @type any*/
      await createJsonRpcFetcher(url).request({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [numberToHex(tag), true]
      });
    } else if ([
      void 0,
      "latest",
      "earliest",
      "pending",
      "safe",
      "finalized"
    ].includes(tag)) {
      blockResponse = /** @type any*/
      await createJsonRpcFetcher(url).request({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBlockByNumber",
        params: [tag ?? "latest", true]
      });
    } else {
      throw new Error(`Invalid block tag provided: ${tag}`);
    }
    if (blockResponse.error) {
      throw blockResponse.error;
    }
    if (!blockResponse.result) {
      throw new Error(
        "Malformed JSON-RPC response: No data nor errors returned in JSON-RPC request to forkUrl"
      );
    }
    const uncleHeaders = await Promise.all(
      /** @type {Array<unknown>}*/
      blockResponse.result.uncles.map((_, i) => {
        return createJsonRpcFetcher(url).request({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getUncleByBlockHashAndIndex",
          params: [
            /**@type {import('@ethereumjs/block').JsonRpcBlock}*/
            blockResponse.result.hash,
            numberToHex(i)
          ]
        });
      })
    );
    const chain = await _TevmBlockchain.create(blockchainOptions);
    const supportedTransactions = blockResponse.result.transactions.filter(
      (tx) => typeof tx === "string" || Object.values(txType).includes(
        hexToNumber(
          /**@type {import('viem').Hex}*/
          tx.type
        )
      )
    );
    await chain.putBlock(
      Block.fromRPC(
        { ...blockResponse.result, transactions: supportedTransactions },
        uncleHeaders,
        blockchainOptions?.common ? { common: blockchainOptions.common } : void 0
      )
    );
    return chain;
  };
  /**
   * @type {import('@ethereumjs/block').Block | undefined}
   */
  #pendingBlock = void 0;
  /**
   * @returns {Promise<import('@ethereumjs/block').Block | undefined>}
   */
  getPendingBlock = async () => {
    return this.#pendingBlock;
  };
  /**
   * @param {import('@ethereumjs/block').Block | undefined} block
   * @returns {Promise<void>}
   */
  setPendingBlock = async (block) => {
    this.#pendingBlock = block;
  };
  /**
   * @param {object} options
   * @param {import('viem').BlockTag | bigint} options.tag
   */
  getBlockByOption = async ({ tag }) => {
    switch (tag) {
      case void 0:
      case "pending":
        return this.getPendingBlock();
      case "earliest":
        return this.getBlock(0n);
      case "latest":
        return this.getCanonicalHeadBlock();
      case "safe":
        return this.getIteratorHeadSafe();
      case "finalized":
        throw new Error("Tevm does not support finalized block tag");
      default: {
        const latest = await this.getCanonicalHeadBlock();
        if (tag > latest.header.number) {
          const err = {
            _tag: "InvalidBlockError",
            name: "InvalidBlockError",
            message: "specified block greater than current height"
          };
          throw err;
        }
        if (tag === latest.header.number) {
          return latest;
        }
        return this.getBlock(tag);
      }
    }
  };
};

export { TevmBlockchain };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map