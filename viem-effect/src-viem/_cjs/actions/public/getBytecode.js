"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBytecode = void 0;
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function getBytecode(client, { address, blockNumber, blockTag = 'latest' }) {
    const blockNumberHex = blockNumber !== undefined ? (0, toHex_js_1.numberToHex)(blockNumber) : undefined;
    const hex = await client.request({
        method: 'eth_getCode',
        params: [address, blockNumberHex || blockTag],
    });
    if (hex === '0x')
        return undefined;
    return hex;
}
exports.getBytecode = getBytecode;
//# sourceMappingURL=getBytecode.js.map