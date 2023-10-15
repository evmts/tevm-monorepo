import { defineChain } from '../../utils/chain.js';
export const confluxESpace = /*#__PURE__*/ defineChain({
    id: 1030,
    name: 'Conflux eSpace',
    network: 'cfx-espace',
    nativeCurrency: { name: 'Conflux', symbol: 'CFX', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://evm.confluxrpc.org'],
        },
        public: {
            http: ['https://evm.confluxrpc.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'ConfluxScan',
            url: 'https://evm.confluxscan.io',
        },
    },
    contracts: {
        multicall3: {
            address: '0xEFf0078910f638cd81996cc117bccD3eDf2B072F',
            blockCreated: 68602935,
        },
    },
});
//# sourceMappingURL=confluxESpace.js.map