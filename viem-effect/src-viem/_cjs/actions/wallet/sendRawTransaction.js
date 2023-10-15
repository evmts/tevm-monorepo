"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRawTransaction = void 0;
async function sendRawTransaction(client, { serializedTransaction }) {
    return client.request({
        method: 'eth_sendRawTransaction',
        params: [serializedTransaction],
    });
}
exports.sendRawTransaction = sendRawTransaction;
//# sourceMappingURL=sendRawTransaction.js.map