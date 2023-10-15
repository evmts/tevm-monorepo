import { defineChain } from '../../utils/chain.js';
export const zhejiang = /*#__PURE__*/ defineChain({
    id: 1337803,
    network: 'zhejiang',
    name: 'Zhejiang',
    nativeCurrency: { name: 'Zhejiang Ether', symbol: 'ZhejETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.zhejiang.ethpandaops.io'],
        },
        public: {
            http: ['https://rpc.zhejiang.ethpandaops.io'],
        },
    },
    blockExplorers: {
        beaconchain: {
            name: 'Etherscan',
            url: 'https://zhejiang.beaconcha.in',
        },
        blockscout: {
            name: 'Blockscout',
            url: 'https://blockscout.com/eth/zhejiang-testnet',
        },
        default: {
            name: 'Beaconchain',
            url: 'https://zhejiang.beaconcha.in',
        },
    },
    testnet: true,
});
//# sourceMappingURL=zhejiang.js.map