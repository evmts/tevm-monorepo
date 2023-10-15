"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxpoolContent = void 0;
async function getTxpoolContent(client) {
    return await client.request({
        method: 'txpool_content',
    });
}
exports.getTxpoolContent = getTxpoolContent;
//# sourceMappingURL=getTxpoolContent.js.map