import { createPublicClient, http } from 'viem';
import {
  arbitrum,
  base,
  foundry,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'viem/chains';

import { Chain } from '@/lib/types/providers';

const alchemyApiKey = process.env.ALCHEMY_API_KEY || '';

/* ------------------------------- CONSTANTS ------------------------------- */
const CHAINS_DATA = {
  arbitrum: {
    ...arbitrum,
    custom: {
      rpcUrl: 'https://arb-mainnet.g.alchemy.com/v2/',
    },
  },
  base: {
    ...base,
    custom: {
      rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
    },
  },
  mainnet: {
    ...mainnet,
    custom: {
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    },
  },
  optimism: {
    ...optimism,
    custom: {
      rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/',
    },
  },
  polygon: {
    ...polygon,
    custom: {
      rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
    },
  },
  sepolia: {
    ...sepolia,
    custom: {
      rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/',
    },
  },
  hardhat: {
    ...foundry,
    custom: {
      rpcUrl: 'http://localhost:8545',
    },
  },
};

const createProvider = (chain: Omit<Chain, 'custom'>, rpcUrl: string) => {
  return createPublicClient({
    chain,
    transport:
      chain.id === 31337 ? http(rpcUrl) : http(`${rpcUrl}${alchemyApiKey}`),
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
