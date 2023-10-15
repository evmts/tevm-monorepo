"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBalance = void 0;
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function setBalance(client, { address, value }) {
    if (client.mode === 'ganache')
        await client.request({
            method: 'evm_setAccountBalance',
            params: [address, (0, toHex_js_1.numberToHex)(value)],
        });
    else
        await client.request({
            method: `${client.mode}_setBalance`,
            params: [address, (0, toHex_js_1.numberToHex)(value)],
        });
}
exports.setBalance = setBalance;
//# sourceMappingURL=setBalance.js.map