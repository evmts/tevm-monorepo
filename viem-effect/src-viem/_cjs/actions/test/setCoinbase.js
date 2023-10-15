"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCoinbase = void 0;
async function setCoinbase(client, { address }) {
    await client.request({
        method: `${client.mode}_setCoinbase`,
        params: [address],
    });
}
exports.setCoinbase = setCoinbase;
//# sourceMappingURL=setCoinbase.js.map