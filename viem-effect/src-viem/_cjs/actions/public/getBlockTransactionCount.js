"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockTransactionCount = void 0;
const fromHex_js_1 = require("../../utils/encoding/fromHex.js");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function getBlockTransactionCount(client, { blockHash, blockNumber, blockTag = 'latest', } = {}) {
    const blockNumberHex = blockNumber !== undefined ? (0, toHex_js_1.numberToHex)(blockNumber) : undefined;
    let count;
    if (blockHash) {
        count = await client.request({
            method: 'eth_getBlockTransactionCountByHash',
            params: [blockHash],
        });
    }
    else {
        count = await client.request({
            method: 'eth_getBlockTransactionCountByNumber',
            params: [blockNumberHex || blockTag],
        });
    }
    return (0, fromHex_js_1.hexToNumber)(count);
}
exports.getBlockTransactionCount = getBlockTransactionCount;
//# sourceMappingURL=getBlockTransactionCount.js.map