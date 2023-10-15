"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metisGoerli = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.metisGoerli = (0, chain_js_1.defineChain)({
    id: 599,
    name: 'Metis Goerli',
    network: 'metis-goerli',
    nativeCurrency: {
        decimals: 18,
        name: 'Metis Goerli',
        symbol: 'METIS',
    },
    rpcUrls: {
        default: { http: ['https://goerli.gateway.metisdevops.link'] },
        public: { http: ['https://goerli.gateway.metisdevops.link'] },
    },
    blockExplorers: {
        default: {
            name: 'Metis Goerli Explorer',
            url: 'https://goerli.explorer.metisdevops.link',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1006207,
        },
    },
});
//# sourceMappingURL=metisGoerli.js.map