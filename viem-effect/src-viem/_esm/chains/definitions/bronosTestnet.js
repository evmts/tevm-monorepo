import { defineChain } from '../../utils/chain.js';
export const bronosTestnet = /*#__PURE__*/ defineChain({
    id: 1038,
    name: 'Bronos Testnet',
    network: 'bronos-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Bronos Coin',
        symbol: 'tBRO',
    },
    rpcUrls: {
        default: { http: ['https://evm-testnet.bronos.org'] },
        public: { http: ['https://evm-testnet.bronos.org'] },
    },
    blockExplorers: {
        default: { name: 'BronoScan', url: 'https://tbroscan.bronos.org' },
    },
    testnet: true,
});
//# sourceMappingURL=bronosTestnet.js.map