import { defineChain } from '../../../utils/chain.js';
export const skaleCalypso = /*#__PURE__*/ defineChain({
    id: 1564830818,
    name: 'SKALE | Calypso NFT Hub',
    network: 'skale-calypso',
    nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague'],
            webSocket: [
                'wss://mainnet.skalenodes.com/v1/ws/honorable-steel-rasalhague',
            ],
        },
        public: {
            http: ['https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague'],
            webSocket: [
                'wss://mainnet.skalenodes.com/v1/ws/honorable-steel-rasalhague',
            ],
        },
    },
    blockExplorers: {
        blockscout: {
            name: 'SKALE Explorer',
            url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com',
        },
        default: {
            name: 'SKALE Explorer',
            url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 3107626,
        },
    },
});
//# sourceMappingURL=calypso.js.map