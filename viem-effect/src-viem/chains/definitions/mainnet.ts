import { defineChain } from '../../utils/chain.js'

export const mainnet = /*#__PURE__*/ defineChain({
  id: 1,
  network: 'homestead',
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-mainnet.g.alchemy.com/v2'],
      webSocket: ['wss://eth-mainnet.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://mainnet.infura.io/v3'],
      webSocket: ['wss://mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://cloudflare-eth.com'],
    },
    public: {
      http: ['https://cloudflare-eth.com'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62',
      blockCreated: 16966585,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
})
