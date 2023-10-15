"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutomine = void 0;
async function getAutomine(client) {
    if (client.mode === 'ganache')
        return await client.request({
            method: 'eth_mining',
        });
    return await client.request({
        method: `${client.mode}_getAutomine`,
    });
}
exports.getAutomine = getAutomine;
//# sourceMappingURL=getAutomine.js.map