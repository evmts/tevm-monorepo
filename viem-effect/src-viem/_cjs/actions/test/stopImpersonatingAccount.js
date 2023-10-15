"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopImpersonatingAccount = void 0;
async function stopImpersonatingAccount(client, { address }) {
    await client.request({
        method: `${client.mode}_stopImpersonatingAccount`,
        params: [address],
    });
}
exports.stopImpersonatingAccount = stopImpersonatingAccount;
//# sourceMappingURL=stopImpersonatingAccount.js.map