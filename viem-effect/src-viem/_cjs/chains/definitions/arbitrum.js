"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arbitrum = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.arbitrum = (0, chain_js_1.defineChain)({
    id: 42161,
    name: 'Arbitrum One',
    network: 'arbitrum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        alchemy: {
            http: ['https://arb-mainnet.g.alchemy.com/v2'],
            webSocket: ['wss://arb-mainnet.g.alchemy.com/v2'],
        },
        infura: {
            http: ['https://arbitrum-mainnet.infura.io/v3'],
            webSocket: ['wss://arbitrum-mainnet.infura.io/ws/v3'],
        },
        default: {
            http: ['https://arb1.arbitrum.io/rpc'],
        },
        public: {
            http: ['https://arb1.arbitrum.io/rpc'],
        },
    },
    blockExplorers: {
        etherscan: { name: 'Arbiscan', url: 'https://arbiscan.io' },
        default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 7654707,
        },
    },
});
//# sourceMappingURL=arbitrum.js.map