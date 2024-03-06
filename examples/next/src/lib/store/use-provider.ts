import { extractChain } from 'viem';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Chain, Client } from '@/lib/types/providers';
import { DEFAULT_CHAIN } from '@/lib/constants/defaults';
import { CHAINS } from '@/lib/constants/providers';
import { TEVM_PREFIX } from '@/lib/local-storage';
import { initializeClient } from '@/lib/tevm';

/* ---------------------------------- TYPES --------------------------------- */
type ProviderInitialState = {
  chain: Chain;
  chainId: Chain['id']; // synced with local storage
  client: Client | null;
  forkTime: Record<Chain['id'], number>; // synced with local storage
  initializedClients: Client[] | [];
  initializing: boolean;

  isHydrated: boolean;
};

type ProviderSetState = {
  setProvider: (chain: Chain) => Promise<Client | null>;
  setForkTime: (chainId: Chain['id'], status?: 'loading' | 'update') => void;

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
      setProvider: async (chain) => {
        const { initializing, initializedClients, forkTime, setForkTime } =
          get();
        // The user should not be able to change the chain while a client is being initialized
        if (initializing) return null;

        set({ initializing: true });

        // Try to find the client for the selected chain if it was already initialized
        let client: Client | undefined = undefined;
        for (const c of initializedClients) {
          if ((await c.getChainId()) === chain.id) {
            client = c;
          }
        }

        // If not found, initialize a new client
        if (!client) {
          // TODO TEMP await because of lazy import
          client = await initializeClient(chain);
          await client.ready();

          // Set its fork time if it's never been initialized
          // This is aligned with the client being completely new, or already used
          // before (synced with local storage)
          if (forkTime[chain.id] === undefined) setForkTime(chain.id);

          // Add the client to the list of initialized clients
          set({ initializedClients: [...initializedClients, client] });
        }

        set({ chain, client, initializing: false });
        return client;
      },

      // Set the fork time for a given chain
      setForkTime: (chainId, status = 'update') => {
        set((state) => ({
          forkTime: {
            ...state.forkTime,
            // 0 means loading, otherwise it's the timestamp
            [chainId]: status === 'update' ? Date.now() : 0,
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
        if (error) console.error('Failed to rehydrate provider store:', error);
        if (!state) return;

        // Retrieve the full chain object from the id
        const { chainId, setProvider, hydrate } = state;
        const chain = extractChain({ chains: CHAINS, id: chainId });

        setProvider(chain);
        hydrate();
      },
    },
  ),
);
