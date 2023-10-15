"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissions = void 0;
async function getPermissions(client) {
    const permissions = await client.request({ method: 'wallet_getPermissions' });
    return permissions;
}
exports.getPermissions = getPermissions;
//# sourceMappingURL=getPermissions.js.map