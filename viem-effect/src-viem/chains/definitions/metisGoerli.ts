import { defineChain } from '../../utils/chain.js'

export const metisGoerli = /*#__PURE__*/ defineChain({
  id: 599,
  name: 'Metis Goerli',
  network: 'metis-goerli',
  nativeCurrency: {
    decimals: 18,
    name: 'Metis Goerli',
    symbol: 'METIS',
  },
  rpcUrls: {
    default: { http: ['https://goerli.gateway.metisdevops.link'] },
    public: { http: ['https://goerli.gateway.metisdevops.link'] },
  },
  blockExplorers: {
    default: {
      name: 'Metis Goerli Explorer',
      url: 'https://goerli.explorer.metisdevops.link',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1006207,
    },
  },
})
