"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polygonMumbai = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.polygonMumbai = (0, chain_js_1.defineChain)({
    id: 80001,
    name: 'Polygon Mumbai',
    network: 'maticmum',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: {
        alchemy: {
            http: ['https://polygon-mumbai.g.alchemy.com/v2'],
            webSocket: ['wss://polygon-mumbai.g.alchemy.com/v2'],
        },
        infura: {
            http: ['https://polygon-mumbai.infura.io/v3'],
            webSocket: ['wss://polygon-mumbai.infura.io/ws/v3'],
        },
        default: {
            http: ['https://rpc.ankr.com/polygon_mumbai'],
        },
        public: {
            http: ['https://rpc.ankr.com/polygon_mumbai'],
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com',
        },
        default: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160,
        },
    },
    testnet: true,
});
//# sourceMappingURL=polygonMumbai.js.map