import { defineChain } from '../../utils/chain.js';
export const hardhat = /*#__PURE__*/ defineChain({
    id: 31337,
    name: 'Hardhat',
    network: 'hardhat',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
        public: { http: ['http://127.0.0.1:8545'] },
    },
});
//# sourceMappingURL=hardhat.js.map