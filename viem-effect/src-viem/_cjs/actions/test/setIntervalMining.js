"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIntervalMining = void 0;
async function setIntervalMining(client, { interval }) {
    await client.request({
        method: 'evm_setIntervalMining',
        params: [interval],
    });
}
exports.setIntervalMining = setIntervalMining;
//# sourceMappingURL=setIntervalMining.js.map