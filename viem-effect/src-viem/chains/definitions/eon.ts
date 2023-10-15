import { defineChain } from '../../utils/chain.js'

export const eon = /*#__PURE__*/ defineChain({
  id: 7_332,
  name: 'Horizen EON',
  network: 'eon',
  nativeCurrency: {
    decimals: 18,
    name: 'ZEN',
    symbol: 'ZEN',
  },
  rpcUrls: {
    public: { http: ['https://eon-rpc.horizenlabs.io/ethv1'] },
    default: { http: ['https://eon-rpc.horizenlabs.io/ethv1'] },
  },
  blockExplorers: {
    default: {
      name: 'EON Explorer',
      url: 'https://eon-explorer.horizenlabs.io',
    },
  },
  contracts: {},
})
