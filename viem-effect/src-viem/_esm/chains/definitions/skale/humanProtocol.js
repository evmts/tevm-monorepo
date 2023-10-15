import { defineChain } from '../../../utils/chain.js';
export const skaleHumanProtocol = /*#__PURE__*/ defineChain({
    id: 1273227453,
    name: 'SKALE | Human Protocol',
    network: 'skale-human-protocol',
    nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.skalenodes.com/v1/wan-red-ain'],
            webSocket: ['wss://mainnet.skalenodes.com/v1/ws/wan-red-ain'],
        },
        public: {
            http: ['https://mainnet.skalenodes.com/v1/wan-red-ain'],
            webSocket: ['wss://mainnet.skalenodes.com/v1/ws/wan-red-ain'],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'SKALE Explorer',
            url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com',
        },
        default: {
            name: 'SKALE Explorer',
            url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com',
        },
    },
    contracts: {},
});
//# sourceMappingURL=humanProtocol.js.map