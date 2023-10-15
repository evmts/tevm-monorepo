"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStorageAt = void 0;
const toHex_js_1 = require("../../utils/encoding/toHex.js");
async function setStorageAt(client, { address, index, value }) {
    await client.request({
        method: `${client.mode}_setStorageAt`,
        params: [
            address,
            typeof index === 'number' ? (0, toHex_js_1.numberToHex)(index) : index,
            value,
        ],
    });
}
exports.setStorageAt = setStorageAt;
//# sourceMappingURL=setStorageAt.js.map