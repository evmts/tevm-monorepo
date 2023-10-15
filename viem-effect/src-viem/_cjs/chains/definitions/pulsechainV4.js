"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pulsechainV4 = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.pulsechainV4 = (0, chain_js_1.defineChain)({
    id: 943,
    network: 'pulsechainV4',
    name: 'PulseChain V4',
    testnet: true,
    nativeCurrency: { name: 'V4 Pulse', symbol: 'v4PLS', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.v4.testnet.pulsechain.com'],
            webSocket: ['wss://ws.v4.testnet.pulsechain.com'],
        },
        public: {
            http: ['https://rpc.v4.testnet.pulsechain.com'],
            webSocket: ['wss://ws.v4.testnet.pulsechain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'PulseScan',
            url: 'https://scan.v4.testnet.pulsechain.com',
        },
    },
    contracts: {
        ensRegistry: {
            address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 14353601,
        },
    },
});
//# sourceMappingURL=pulsechainV4.js.map