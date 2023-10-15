"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionCount = void 0;
const fromHex_js_1 = require("../../utils/encoding/fromHex.js");
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function getTransactionCount(client, { address, blockTag = 'latest', blockNumber }) {
    const count = await client.request({
        method: 'eth_getTransactionCount',
        params: [address, blockNumber ? (0, toHex_js_1.numberToHex)(blockNumber) : blockTag],
    });
    return (0, fromHex_js_1.hexToNumber)(count);
}
exports.getTransactionCount = getTransactionCount;
//# sourceMappingURL=getTransactionCount.js.map