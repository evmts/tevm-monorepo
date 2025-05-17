import config from "contracts/mud.config";
// import { getChain, worldAddress } from "../common";
import { http } from "viem";
import { createSyncAdapter } from "@latticexyz/store-sync/internal";
import { anvil } from "viem/chains";
import { createStash } from "@latticexyz/stash/internal";
import { createMemoryClient, createCommon, createOptimisticStash, mudStoreForkInterceptor, type MemoryClient } from "@tevm/mud";

// TODO: fix that, triggers probably some cyclical dependecy/trying to access chainId before declaration
// const chain = getChain()
const chain = anvil
const worldAddress = "0xfDf868Ea710FfD8cd33b829c5AFf79eDd15EcD5f"

// Create the original memory client
export const memoryClient: MemoryClient = createMemoryClient({
  fork: {
    transport: http(chain.rpcUrls.default.http[0])({
      chain: chain,
    }),
    blockTag: 'latest',
  },
  // TODO: fix different viem versions between MUD and Tevm that cause this
  common: createCommon(chain),
  // loggingLevel: "debug"
})

export const stash = createOptimisticStash(memoryClient)(config);
// export const stash = createStash(config)
memoryClient.extend(mudStoreForkInterceptor({ stash, storeAddress: worldAddress }))

export const syncAdapter = createSyncAdapter({ stash })