import { forkUrl, createPublicClient, optimism } from "@evmts/core";

export const publicClient = createPublicClient({
  chain: optimism,
  transport: forkUrl({
    url: "https://mainnet.optimism.io",
  }),
})