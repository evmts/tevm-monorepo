import { defineChain } from '../../utils/chain.js';
export const iotexTestnet = /*#__PURE__*/ defineChain({
    id: 4690,
    name: 'IoTeX Testnet',
    network: 'iotex-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'IoTeX',
        symbol: 'IOTX',
    },
    rpcUrls: {
        default: {
            http: ['https://babel-api.testnet.iotex.io'],
            webSocket: ['wss://babel-api.testnet.iotex.io'],
        },
        public: {
            http: ['https://babel-api.testnet.iotex.io'],
            webSocket: ['wss://babel-api.testnet.iotex.io'],
        },
    },
    blockExplorers: {
        default: { name: 'IoTeXScan', url: 'https://testnet.iotexscan.io' },
    },
});
//# sourceMappingURL=iotexTestnet.js.map