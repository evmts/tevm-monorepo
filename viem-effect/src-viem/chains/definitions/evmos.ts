import { defineChain } from '../../utils/chain.js'

export const evmos = /*#__PURE__*/ defineChain({
  id: 9_001,
  name: 'Evmos',
  network: 'evmos',
  nativeCurrency: {
    decimals: 18,
    name: 'Evmos',
    symbol: 'EVMOS',
  },
  rpcUrls: {
    default: { http: ['https://eth.bd.evmos.org:8545'] },
    public: { http: ['https://eth.bd.evmos.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'Evmos Block Explorer', url: 'https://escan.live' },
  },
})
