"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropTransaction = void 0;
async function dropTransaction(client, { hash }) {
    await client.request({
        method: `${client.mode}_dropTransaction`,
        params: [hash],
    });
}
exports.dropTransaction = dropTransaction;
//# sourceMappingURL=dropTransaction.js.map