"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspectTxpool = void 0;
async function inspectTxpool(client) {
    return await client.request({
        method: 'txpool_inspect',
    });
}
exports.inspectTxpool = inspectTxpool;
//# sourceMappingURL=inspectTxpool.js.map