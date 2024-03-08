import { createPublicClient, http } from 'viem';
import {
  arbitrum,
  base,
  foundry,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from 'viem/chains';

import { Chain } from '@/lib/types/providers';
import { DEFAULT_ALCHEMY_API_KEY } from '@/lib/constants/defaults';

// Api keys
const alchemyApiKey = process.env.ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY;
// Any Etherscan compatible API key
// See `Chain.blockExplorers.default.apiUrl` for the base URL
const explorerApiKey = {
  mainnet: process.env.ETHERSCAN_API_KEY || '',
  arbitrum: process.env.ARBISCAN_API_KEY || '',
  base: process.env.BASESCAN_API_KEY || '',
  optimism: process.env.OPTIMISTIC_ETHERSCAN_API_KEY || '',
  polygon: process.env.POLYGONSCAN_API_KEY || '',
  zora: process.env.ZORA_SUPERSCAN_API_KEY || '',
};

// Chains that don't need an API key
export const STANDALONE_RPC_CHAINS = [
  // Foundry/Hardhat
  31337,
  // Zora
  7777777,
];

/* ------------------------------- CONSTANTS ------------------------------- */
const CHAINS_DATA = {
  arbitrum: {
    ...arbitrum,
    custom: {
      rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
      explorerApiKey: explorerApiKey.arbitrum,
    },
  },
  base: {
    ...base,
    custom: {
      rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
      explorerApiKey: explorerApiKey.base,
    },
  },
  foundry: {
    ...foundry,
    custom: {
      rpcUrl: 'http://localhost:8545',
    },
  },
  mainnet: {
    ...mainnet,
    custom: {
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
      explorerApiKey: explorerApiKey.mainnet,
    },
  },
  optimism: {
    ...optimism,
    custom: {
      rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/',
      explorerApiKey: explorerApiKey.optimism,
    },
  },
  polygon: {
    ...polygon,
    custom: {
      rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
      explorerApiKey: explorerApiKey.polygon,
    },
  },
  sepolia: {
    ...sepolia,
    custom: {
      rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/',
      explorerApiKey: explorerApiKey.mainnet,
    },
  },
  zora: {
    ...zora,
    custom: {
      rpcUrl: 'https://rpc.zora.energy/',
      explorerApiKey: explorerApiKey.zora,
    },
  },
};

const createProvider = (chain: Omit<Chain, 'custom'>, rpcUrl: string) => {
  return createPublicClient({
    chain,
    transport: STANDALONE_RPC_CHAINS.includes(chain.id)
      ? http(rpcUrl)
      : http(`${rpcUrl}${alchemyApiKey}`),
  });
};

/* --------------------------------- CHAINS -------------------------------- */
/**
 * @notice The providers for each chain/fork
 * @dev This will create a `chain` property containing Viem chain objects, a Viem provider,
 * and a Tevm memory client.
 */
export const CHAINS: Chain[] = Object.values(CHAINS_DATA).map((chain) => ({
  ...chain,
  custom: {
    ...chain.custom,
    provider: createProvider(chain, chain.custom.rpcUrl),
  },
}));
