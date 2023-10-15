import { defineChain } from '../../utils/chain.js';
export const taraxaTestnet = /*#__PURE__*/ defineChain({
    id: 842,
    name: 'Taraxa Testnet',
    network: 'taraxa-testnet',
    nativeCurrency: { name: 'Tara', symbol: 'TARA', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.testnet.taraxa.io'],
        },
        public: {
            http: ['https://rpc.testnet.taraxa.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Taraxa Explorer',
            url: 'https://explorer.testnet.taraxa.io',
        },
    },
    testnet: true,
});
//# sourceMappingURL=taraxaTestnet.js.map