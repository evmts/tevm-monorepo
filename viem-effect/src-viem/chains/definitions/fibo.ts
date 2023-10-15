import { defineChain } from '../../utils/chain.js'

export const fibo = /*#__PURE__*/ defineChain({
  id: 12306,
  name: 'Fibo Chain',
  network: 'fibochain',
  nativeCurrency: {
    decimals: 18,
    name: 'fibo',
    symbol: 'FIBO',
  },
  rpcUrls: {
    default: { http: ['https://network.hzroc.art'] },
    public: { http: ['https://network.hzroc.art'] },
  },
  blockExplorers: {
    default: { name: 'FiboScan', url: 'https://scan.fibochain.org' },
  },
})
