import { defineChain } from '../../utils/chain.js';
export const nexilix = /*#__PURE__*/ defineChain({
    id: 240,
    name: 'Nexilix Smart Chain',
    network: 'nexilix',
    nativeCurrency: {
        decimals: 18,
        name: 'Nexilix',
        symbol: 'NEXILIX',
    },
    rpcUrls: {
        default: { http: ['https://rpcurl.pos.nexilix.com'] },
        public: { http: ['https://rpcurl.pos.nexilix.com'] },
    },
    blockExplorers: {
        etherscan: { name: 'NexilixScan', url: 'https://scan.nexilix.com' },
        default: { name: 'NexilixScan', url: 'https://scan.nexilix.com' },
    },
    contracts: {
        multicall3: {
            address: '0x58381c8e2BF9d0C2C4259cA14BdA9Afe02831244',
            blockCreated: 74448,
        },
    },
});
//# sourceMappingURL=nexilix.js.map