"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardhat = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.hardhat = (0, chain_js_1.defineChain)({
    id: 31337,
    name: 'Hardhat',
    network: 'hardhat',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
        public: { http: ['http://127.0.0.1:8545'] },
    },
});
//# sourceMappingURL=hardhat.js.map