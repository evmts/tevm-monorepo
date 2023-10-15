"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sepolia = void 0;
const chain_js_1 = require("../../utils/chain.js");
exports.sepolia = (0, chain_js_1.defineChain)({
    id: 11155111,
    network: 'sepolia',
    name: 'Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
    rpcUrls: {
        alchemy: {
            http: ['https://eth-sepolia.g.alchemy.com/v2'],
            webSocket: ['wss://eth-sepolia.g.alchemy.com/v2'],
        },
        infura: {
            http: ['https://sepolia.infura.io/v3'],
            webSocket: ['wss://sepolia.infura.io/ws/v3'],
        },
        default: {
            http: ['https://rpc.sepolia.org'],
        },
        public: {
            http: ['https://rpc.sepolia.org'],
        },
    },
    blockExplorers: {
        etherscan: {
            name: 'Etherscan',
            url: 'https://sepolia.etherscan.io',
        },
        default: {
            name: 'Etherscan',
            url: 'https://sepolia.etherscan.io',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 6507670,
        },
        ensRegistry: { address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
        ensUniversalResolver: {
            address: '0x21B000Fd62a880b2125A61e36a284BB757b76025',
            blockCreated: 3914906,
        },
    },
    testnet: true,
});
//# sourceMappingURL=sepolia.js.map