"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshot = void 0;
async function snapshot(client) {
    return await client.request({
        method: 'evm_snapshot',
    });
}
exports.snapshot = snapshot;
//# sourceMappingURL=snapshot.js.map