"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCode = void 0;
async function setCode(client, { address, bytecode }) {
    await client.request({
        method: `${client.mode}_setCode`,
        params: [address, bytecode],
    });
}
exports.setCode = setCode;
//# sourceMappingURL=setCode.js.map