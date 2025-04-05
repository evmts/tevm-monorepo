import { MemoryClient } from "tevm";
import { Address, getAddress } from "tevm/utils";
import { extractChain, http } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Chain } from "../types/providers";
import { DEFAULT_CHAIN } from "../constants/defaults";
import {
  ALCHEMY_API_KEY,
  CHAINS,
  STANDALONE_RPC_CHAINS,
} from "../constants/providers";
import { TEVM_PREFIX } from "../local-storage";
import { useConfigStore } from "./use-config";

/* ---------------------------------- TYPES --------------------------------- */
type ProviderInitialState = {
  chain: Chain;
  chainId: Chain["id"]; // synced with local storage
  client: MemoryClient | null;
  forkTime: Record<Chain["id"], number>; // synced with local storage
  initializedClients: MemoryClient[] | [];
  initializing: boolean;

  isHydrated: boolean;
};

type ProviderSetState = {
  setProvider: (
    chain: Chain,
    address: Address | undefined,
  ) => Promise<MemoryClient | null>;
  setForkTime: (chainId: Chain["id"], status?: "loading" | "update") => void;

  hydrate: () => void;
};

type ProviderStore = ProviderInitialState & ProviderSetState;

/* ---------------------------------- STORE --------------------------------- */
/**
 * @notice A store to manage the current chain selection and the associated Tevm client
 */
export const useProviderStore = create<ProviderStore>()(
  persist(
    (set, get) => ({
      // The current chain the contract is on
      chain: DEFAULT_CHAIN,
      chainId: DEFAULT_CHAIN.id,
      // The current Tevm client
      client: null,
      // The timestamp of the fork for each chain (when first initialized or when reset)
      forkTime: CHAINS.reduce(
        (acc, chain) => ({ ...acc, [chain.id]: undefined }),
        {},
      ),
      // The hydratation status to prevent displaying default values on first mount
      // when the local storage is not yet rehydrated
      isHydrated: false,

      // Clients that were already initialized
      initializedClients: [],
      // Whether a client is being initialized
      initializing: false,

      // Set the selected chain and its client on user selection (or on first mount)
      // Fetch the state of the account if there is one
      setProvider: async (chain, address) => {
        const {
          client: currentClient,
          initializing,
          initializedClients,
          forkTime,
          setForkTime,
        } = get();
        // The user should not be able to change the chain while a client is being initialized
        if (initializing) return null;

        set({ initializing: true });

        // An error might occur, e.g. if trying to connect to a local chain when it's not running
        try {
          // 1. Check if we already have the appropriate client for the selected chain
          // e.g. when searching a different account on the same chain
          let client =
            (await currentClient?.getChainId()) === chain.id
              ? currentClient
              : null;

          // 2. If not found, try to find the client for the selected chain if it was
          // already initialized earlier
          if (!client) {
            for (const c of initializedClients) {
              if ((await c.getChainId()) === chain.id) {
                client = c;
              }
            }
          }

          // 3. If not found, initialize a new client
          if (!client) {
            // TODO TEMP await because of lazy import
            const { createMemoryClient } = await import("tevm");
            const { createSyncStoragePersister } = await import(
              "tevm/sync-storage-persister"
            );

            const forkUrl = chain.custom.rpcUrl;

            client = createMemoryClient({
              persister: createSyncStoragePersister({
                storage: localStorage,
                key: `TEVM_CLIENT_${chain.id.toString()}`,
              }),
              fork: {
                transport: http(
                  STANDALONE_RPC_CHAINS.includes(chain.id)
                    ? forkUrl
                    : `${forkUrl}${ALCHEMY_API_KEY}`,
                )({}),
              },
            });

            await client.tevmReady();

            // Set its fork time if it's never been initialized
            // This is aligned with the client being completely new, or already used
            // before (synced with local storage)
            if (forkTime[chain.id] === undefined) setForkTime(chain.id);

            // Add the client to the list of initialized clients
            set({ initializedClients: [...initializedClients, client] });
          }

          set({ chain, client, initializing: false });

          // 4. If an address is provided, update the state of the account on this chain
          if (address && client) {
            useConfigStore.getState().updateAccount(address, {
              updateAbi: true,
              chain,
              client,
            });
          }

          return client;
        } catch (err) {
          console.error("Failed to set provider:", err);
          set({ initializing: false });
          return null;
        }
      },

      // Set the fork time for a given chain
      setForkTime: (chainId, status = "update") => {
        set((state) => ({
          forkTime: {
            ...state.forkTime,
            // 0 means loading, otherwise it's the timestamp
            [chainId]: status === "update" ? Date.now() : 0,
          },
        }));
      },

      hydrate: () => set({ isHydrated: true }),
    }),
    {
      name: `${TEVM_PREFIX}provider`,
      storage: createJSONStorage(() => localStorage),
      // We only need to store the chain id and the fork time
      partialize: (state: ProviderStore) => ({
        chainId: state.chain.id,
        forkTime: state.forkTime,
      }),
      onRehydrateStorage: () => async (state, error) => {
        if (error) console.error("Failed to rehydrate provider store:", error);
        if (!state) return;

        // Retrieve the full chain object from the id
        const { chainId, setProvider, hydrate } = state;
        const chain = extractChain({ chains: CHAINS, id: chainId });

        // In case the user is directly landing on an address page (or refreshing)
        const addressInSearch = window.location.pathname.split("/").pop();
        const address = addressInSearch
          ? getAddress(addressInSearch)
          : undefined;

        setProvider(chain, address);
        hydrate();
      },
    },
  ),
);
