import { defineChain } from '../../utils/chain.js';
export const ekta = /*#__PURE__*/ defineChain({
    id: 1994,
    name: 'Ekta',
    network: 'ekta',
    nativeCurrency: {
        decimals: 18,
        name: 'EKTA',
        symbol: 'EKTA',
    },
    rpcUrls: {
        public: { http: ['https://main.ekta.io'] },
        default: { http: ['https://main.ekta.io'] },
    },
    blockExplorers: {
        default: { name: 'Ektascan', url: 'https://ektascan.io' },
    },
});
//# sourceMappingURL=ekta.js.map