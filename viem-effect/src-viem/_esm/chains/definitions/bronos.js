import { defineChain } from '../../utils/chain.js';
export const bronos = /*#__PURE__*/ defineChain({
    id: 1039,
    name: 'Bronos',
    network: 'bronos',
    nativeCurrency: {
        decimals: 18,
        name: 'BRO',
        symbol: 'BRO',
    },
    rpcUrls: {
        default: { http: ['https://evm.bronos.org'] },
        public: { http: ['https://evm.bronos.org'] },
    },
    blockExplorers: {
        default: { name: 'BronoScan', url: 'https://broscan.bronos.org' },
    },
});
//# sourceMappingURL=bronos.js.map