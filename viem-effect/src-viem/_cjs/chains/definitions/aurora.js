"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aurora = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.aurora = (0, chain_js_1.defineChain)({
    id: 1313161554,
    name: 'Aurora',
    network: 'aurora',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        infura: { http: ['https://aurora-mainnet.infura.io/v3'] },
        default: { http: ['https://mainnet.aurora.dev'] },
        public: { http: ['https://mainnet.aurora.dev'] },
    },
    blockExplorers: {
        etherscan: { name: 'Aurorascan', url: 'https://aurorascan.dev' },
        default: { name: 'Aurorascan', url: 'https://aurorascan.dev' },
    },
});
//# sourceMappingURL=aurora.js.map