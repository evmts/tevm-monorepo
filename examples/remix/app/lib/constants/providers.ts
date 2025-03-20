import { createPublicClient, http, Chain as ViemChain } from "viem";
import {
  arbitrum,
  base,
  foundry,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from "viem/chains";

import { Chain } from "../types/providers";

// TODO Create client here when top-level await is solved

export const ALCHEMY_API_KEY =
  process.env.ALCHEMY_API_KEY || "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";

// Chains that don't need an API key
export const STANDALONE_RPC_CHAINS = [
  // Foundry/Hardhat
  31337,
  // Zora
  7777777,
];

/**
 * @notice Create a viem provider for a given chain
 * @param chain The viem chain object
 * @param rpcUrl The RPC URL for the chain
 */
export const createProvider = (chain: ViemChain, rpcUrl: string) => {
  return createPublicClient({
    chain,
    transport: STANDALONE_RPC_CHAINS.includes(chain.id)
      ? http(rpcUrl)
      : http(`${rpcUrl}${ALCHEMY_API_KEY}`),
  });
};

/* --------------------------------- CHAINS --------------------------------- */
export const CHAINS: Chain[] = [
  {
    ...arbitrum,
    custom: {
      rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/",
      provider: createProvider(
        arbitrum,
        "https://arb-mainnet.g.alchemy.com/v2/",
      ),
    },
  },
  {
    ...base,
    custom: {
      rpcUrl: "https://base-mainnet.g.alchemy.com/v2/",
      provider: createProvider(base, "https://base-mainnet.g.alchemy.com/v2/"),
    },
  },
  {
    ...foundry,
    custom: {
      rpcUrl: "http://localhost:8545",
      provider: createProvider(foundry, "http://localhost:8545"),
    },
    name: "Local (Foundry/Hardhat)",
  },
  {
    ...mainnet,
    custom: {
      rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
      provider: createProvider(
        mainnet,
        "https://eth-mainnet.g.alchemy.com/v2/",
      ),
    },
  },
  {
    ...optimism,
    custom: {
      rpcUrl: "https://opt-mainnet.g.alchemy.com/v2/",
      provider: createProvider(
        optimism,
        "https://opt-mainnet.g.alchemy.com/v2/",
      ),
    },
  },
  {
    ...polygon,
    custom: {
      rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/",
      provider: createProvider(
        polygon,
        "https://polygon-mainnet.g.alchemy.com/v2/",
      ),
    },
  },
  {
    ...sepolia,
    custom: {
      rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/",
      provider: createProvider(
        sepolia,
        "https://eth-sepolia.g.alchemy.com/v2/",
      ),
    },
  },
  {
    ...zora,
    custom: {
      rpcUrl: "https://rpc.zora.energy/",
      provider: createProvider(zora, "https://rpc.zora.energy/"),
    },
  },
];
