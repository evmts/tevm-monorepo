"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zkSyncTestnet = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.zkSyncTestnet = (0, chain_js_1.defineChain)({
    id: 280,
    name: 'zkSync Era Testnet',
    network: 'zksync-era-testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://testnet.era.zksync.dev'],
            webSocket: ['wss://testnet.era.zksync.dev/ws'],
        },
        public: {
            http: ['https://testnet.era.zksync.dev'],
            webSocket: ['wss://testnet.era.zksync.dev/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'zkExplorer',
            url: 'https://goerli.explorer.zksync.io',
        },
    },
    contracts: {
        multicall3: {
            address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
        },
    },
    testnet: true,
});
//# sourceMappingURL=zkSyncTestnet.js.map