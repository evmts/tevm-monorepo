import { defineChain } from '../../utils/chain.js';
export const fantomTestnet = /*#__PURE__*/ defineChain({
    id: 4002,
    name: 'Fantom Testnet',
    network: 'fantom-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Fantom',
        symbol: 'FTM',
    },
    rpcUrls: {
        default: { http: ['https://rpc.testnet.fantom.network'] },
        public: { http: ['https://rpc.testnet.fantom.network'] },
    },
    blockExplorers: {
        etherscan: { name: 'FTMScan', url: 'https://testnet.ftmscan.com' },
        default: { name: 'FTMScan', url: 'https://testnet.ftmscan.com' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 8328688,
        },
    },
});
//# sourceMappingURL=fantomTestnet.js.map