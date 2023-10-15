"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockNumber = exports.getBlockNumberCache = void 0;
const withCache_js_1 = require("../../utils/promise/withCache.js");
const cacheKey = (id) => `blockNumber.${id}`;
function getBlockNumberCache(id) {
    return (0, withCache_js_1.getCache)(cacheKey(id));
}
exports.getBlockNumberCache = getBlockNumberCache;
async function getBlockNumber(client, { cacheTime = client.cacheTime, maxAge } = {}) {
    const blockNumberHex = await (0, withCache_js_1.withCache)(() => client.request({
        method: 'eth_blockNumber',
    }), { cacheKey: cacheKey(client.uid), cacheTime: maxAge ?? cacheTime });
    return BigInt(blockNumberHex);
}
exports.getBlockNumber = getBlockNumber;
//# sourceMappingURL=getBlockNumber.js.map