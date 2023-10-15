"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBlockTimestampInterval = void 0;
async function setBlockTimestampInterval(client, { interval }) {
    await client.request({
        method: `${client.mode}_setBlockTimestampInterval`,
        params: [interval],
    });
}
exports.setBlockTimestampInterval = setBlockTimestampInterval;
//# sourceMappingURL=setBlockTimestampInterval.js.map