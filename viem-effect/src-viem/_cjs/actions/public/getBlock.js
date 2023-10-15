"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlock = void 0;
const block_js_1 = require("../../errors/block.js");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
const block_js_2 = require("../../utils/formatters/block.js");
async function getBlock(client, { blockHash, blockNumber, blockTag: blockTag_, includeTransactions: includeTransactions_, } = {}) {
    const blockTag = blockTag_ ?? 'latest';
    const includeTransactions = includeTransactions_ ?? false;
    const blockNumberHex = blockNumber !== undefined ? (0, toHex_js_1.numberToHex)(blockNumber) : undefined;
    let block = null;
    if (blockHash) {
        block = await client.request({
            method: 'eth_getBlockByHash',
            params: [blockHash, includeTransactions],
        });
    }
    else {
        block = await client.request({
            method: 'eth_getBlockByNumber',
            params: [blockNumberHex || blockTag, includeTransactions],
        });
    }
    if (!block)
        throw new block_js_1.BlockNotFoundError({ blockHash, blockNumber });
    const format = client.chain?.formatters?.block?.format || block_js_2.formatBlock;
    return format(block);
}
exports.getBlock = getBlock;
//# sourceMappingURL=getBlock.js.map