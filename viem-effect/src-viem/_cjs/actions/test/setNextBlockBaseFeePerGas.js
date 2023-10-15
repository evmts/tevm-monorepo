"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNextBlockBaseFeePerGas = void 0;
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function setNextBlockBaseFeePerGas(client, { baseFeePerGas }) {
    await client.request({
        method: `${client.mode}_setNextBlockBaseFeePerGas`,
        params: [(0, toHex_js_1.numberToHex)(baseFeePerGas)],
    });
}
exports.setNextBlockBaseFeePerGas = setNextBlockBaseFeePerGas;
//# sourceMappingURL=setNextBlockBaseFeePerGas.js.map