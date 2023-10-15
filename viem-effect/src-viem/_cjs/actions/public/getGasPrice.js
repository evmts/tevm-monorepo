"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasPrice = void 0;
async function getGasPrice(client) {
    const gasPrice = await client.request({
        method: 'eth_gasPrice',
    });
    return BigInt(gasPrice);
}
exports.getGasPrice = getGasPrice;
//# sourceMappingURL=getGasPrice.js.map