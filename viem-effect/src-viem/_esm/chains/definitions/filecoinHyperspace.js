import { defineChain } from '../../utils/chain.js';
export const filecoinHyperspace = /*#__PURE__*/ defineChain({
    id: 3141,
    name: 'Filecoin Hyperspace',
    network: 'filecoin-hyperspace',
    nativeCurrency: {
        decimals: 18,
        name: 'testnet filecoin',
        symbol: 'tFIL',
    },
    rpcUrls: {
        default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
        public: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
    },
    blockExplorers: {
        default: { name: 'Filfox', url: 'https://hyperspace.filfox.info/en' },
        filscan: { name: 'Filscan', url: 'https://hyperspace.filscan.io' },
    },
});
//# sourceMappingURL=filecoinHyperspace.js.map