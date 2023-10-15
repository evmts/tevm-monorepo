import { defineChain } from '../../utils/chain.js';
export const okc = /*#__PURE__*/ defineChain({
    id: 66,
    name: 'OKC',
    network: 'okc',
    nativeCurrency: {
        decimals: 18,
        name: 'OKT',
        symbol: 'OKT',
    },
    rpcUrls: {
        default: { http: ['https://exchainrpc.okex.org'] },
        public: { http: ['https://exchainrpc.okex.org'] },
    },
    blockExplorers: {
        default: { name: 'oklink', url: 'https://www.oklink.com/okc' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 10364792,
        },
    },
});
//# sourceMappingURL=okc.js.map