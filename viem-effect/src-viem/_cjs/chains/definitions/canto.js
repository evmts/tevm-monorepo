"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canto = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.canto = (0, chain_js_1.defineChain)({
    id: 7700,
    name: 'Canto',
    network: 'canto',
    nativeCurrency: {
        decimals: 18,
        name: 'Canto',
        symbol: 'CANTO',
    },
    rpcUrls: {
        default: { http: ['https://canto.gravitychain.io'] },
        public: { http: ['https://canto.gravitychain.io'] },
    },
    blockExplorers: {
        default: {
            name: 'Tuber.Build (Blockscout)',
            url: 'https://tuber.build',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 2905789,
        },
    },
});
//# sourceMappingURL=canto.js.map