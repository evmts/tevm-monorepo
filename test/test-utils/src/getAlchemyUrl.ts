// this file is adapted from ethers
// https://github.com/ethers-io/ethers.js/blob/main/src.ts/providers/provider-alchemy.ts

const DEFAULT_ALCHEMY_KEY = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC"

const ALCHEMY_HOSTS = Object.freeze({
  "mainnet":
    "eth-mainnet.alchemyapi.io",
  "goerli":
    "eth-goerli.g.alchemy.com",
  "sepolia":
    "eth-sepolia.g.alchemy.com",
  "arbitrum":
    "arb-mainnet.g.alchemy.com",
  "arbitrum-goerli":
    "arb-goerli.g.alchemy.com",
  "arbitrum-sepolia":
    "arb-sepolia.g.alchemy.com",
  "base":
    "base-mainnet.g.alchemy.com",
  "base-goerli":
    "base-goerli.g.alchemy.com",
  "base-sepolia":
    "base-sepolia.g.alchemy.com",
  "matic":
    "polygon-mainnet.g.alchemy.com",
  "matic-amoy":
    "polygon-amoy.g.alchemy.com",
  "matic-mumbai":
    "polygon-mumbai.g.alchemy.com",
  "optimism":
    "opt-mainnet.g.alchemy.com",
  "optimism-goerli":
    "opt-goerli.g.alchemy.com",
  "optimism-sepolia":
    "opt-sepolia.g.alchemy.com",
})

/**
 * Returns an alchemy url based on env variables for the given chain
 */
export const getAlchemyUrl = (chainId: keyof typeof ALCHEMY_HOSTS = 'optimism', alchemyKey = process.env['ALCHEMY_KEY'] ?? DEFAULT_ALCHEMY_KEY): string => {
  if (alchemyKey === DEFAULT_ALCHEMY_KEY) {
    console.warn(`Using default alchemy key. Please override it with the 'ALCHEMY_KEY' environment variable or pass in an explicit key as the second arg to 'getAlchemyUrl'
Using default alchemy key '${DEFAULT_ALCHEMY_KEY}' and may face throttling`)
  }
  return ['https://', ALCHEMY_HOSTS[chainId], 'v2', alchemyKey].join('/')
}
