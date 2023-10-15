"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseTime = void 0;
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function increaseTime(client, { seconds }) {
    return await client.request({
        method: 'evm_increaseTime',
        params: [(0, toHex_js_1.numberToHex)(seconds)],
    });
}
exports.increaseTime = increaseTime;
//# sourceMappingURL=increaseTime.js.map