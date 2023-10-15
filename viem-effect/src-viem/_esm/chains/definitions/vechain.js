import { defineChain } from '../../utils/chain.js';
export const vechain = /*#__PURE__*/ defineChain({
    id: 100009,
    name: 'Vechain',
    network: 'vechain',
    nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.vechain.org'],
        },
        public: {
            http: ['https://mainnet.vechain.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Vechain Explorer',
            url: 'https://explore.vechain.org',
        },
        vechainStats: {
            name: 'Vechain Stats',
            url: 'https://vechainstats.com',
        },
    },
});
//# sourceMappingURL=vechain.js.map