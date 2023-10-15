"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronosTestnet = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.cronosTestnet = (0, chain_js_1.defineChain)({
    id: 338,
    name: 'Cronos Testnet',
    network: 'cronos-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'CRO',
        symbol: 'tCRO',
    },
    rpcUrls: {
        default: { http: ['https://evm-t3.cronos.org'] },
        public: { http: ['https://evm-t3.cronos.org'] },
    },
    blockExplorers: {
        default: {
            name: 'Cronos Explorer',
            url: 'https://cronos.org/explorer/testnet3',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 10191251,
        },
    },
    testnet: true,
});
//# sourceMappingURL=cronosTestnet.js.map