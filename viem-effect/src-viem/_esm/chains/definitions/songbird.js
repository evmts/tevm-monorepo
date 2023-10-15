import { defineChain } from '../../utils/chain.js';
export const songbird = /*#__PURE__*/ defineChain({
    id: 19,
    name: 'Songbird Mainnet',
    network: 'songbird-mainnet',
    nativeCurrency: {
        decimals: 18,
        name: 'songbird',
        symbol: 'SGB',
    },
    rpcUrls: {
        default: { http: ['https://songbird-api.flare.network/ext/C/rpc'] },
        public: { http: ['https://songbird-api.flare.network/ext/C/rpc'] },
    },
    blockExplorers: {
        default: {
            name: 'Songbird Explorer',
            url: 'https://songbird-explorer.flare.network',
        },
    },
});
//# sourceMappingURL=songbird.js.map