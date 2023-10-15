"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestPermissions = void 0;
async function requestPermissions(client, permissions) {
    return client.request({
        method: 'wallet_requestPermissions',
        params: [permissions],
    });
}
exports.requestPermissions = requestPermissions;
//# sourceMappingURL=requestPermissions.js.map