import { ABI } from "@shazow/whatsabi/lib.types/abi";
import { toast } from "sonner";
import { GetAccountResult } from "tevm";
import { Address } from "tevm/utils";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { UpdateAccountOptions } from "../types/config";
import { DEFAULT_CALLER } from "../constants/defaults";
import { TEVM_PREFIX } from "../local-storage";
import { fetchAbi } from "../whatsabi";

/* ---------------------------------- TYPES --------------------------------- */
type ConfigInitialState = {
  account: GetAccountResult | null;
  abi: ABI | null;
  fetchingAccount: boolean;
  caller: Address;
  skipBalance: boolean;

  isHydrated: boolean;
};

type ConfigSetState = {
  updateAccount: (
    address: Address,
    options: UpdateAccountOptions,
  ) => Promise<GetAccountResult>;
  setFetchingAccount: (fetching: boolean) => void;
  setAbi: (abi: ABI | null) => void;
  setCaller: (address: Address) => void;
  resetCaller: () => void;
  setSkipBalance: (skip: boolean) => void;

  hydrate: () => void;
};

type ConfigStore = ConfigInitialState & ConfigSetState;

/* ---------------------------------- STORE --------------------------------- */
/**
 * @notice A store to manage the current contract selection and its methods
 */
export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      // A valid Ethereum account (either a contract or an EOA)
      account: null,
      // The contract's abi after it's been fetched with WhatsABI
      abi: null,
      // Whether the account is currently being fetched (also valid for fetching the abi)
      fetchingAccount: false,
      // The current address to impersonate as the caller
      caller: DEFAULT_CALLER,
      // Whether to skip native balance checks during calls
      skipBalance: true,

      // The hydratation status to prevent displaying default values on first mount
      // when the local storage is not yet rehydrated
      isHydrated: false,

      // Update the account with its latest state, and fetch the abi if it's a contract
      // This will be called upon search, chain change/reset, and after making a call
      updateAccount: async (address, { updateAbi, chain, client }) => {
        set({ fetchingAccount: true });
        const account = await client.tevmGetAccount({ address });

        // If we can't be sure if it's a contract, we can attempt to fetch the abi anyway
        if (updateAbi && account.isContract) {
          // TODO maybe it's bad practice to manage the toast here—i.e. in a zuistand store?
          const toastId = toast.loading("Fetching ABI");

          const { success, data: abi } = await fetchAbi(account.address, chain);

          // Set the abi in the store if it's successful
          if (success && abi && abi.length > 0) {
            set({ abi });
            toast.success("ABI fetched", {
              id: toastId,
            });
          } else {
            set({ abi: null });
            toast.error("Failed to retrieve the ABI", {
              id: toastId,
              description:
                "Please make sure this contract is deployed on the selected chain.",
            });
          }
        } else {
          if (updateAbi) set({ abi: null });
        }

        // Set the new account in any case
        set({ account, fetchingAccount: false });

        return account;
      },

      setFetchingAccount: (fetching) => set({ fetchingAccount: fetching }),
      setAbi: (abi) => set({ abi }),
      setCaller: (address) => set({ caller: address }),
      resetCaller: () => set({ caller: DEFAULT_CALLER }),
      setSkipBalance: (skip) => set({ skipBalance: skip }),

      hydrate: () => set({ isHydrated: true }),
    }),
    {
      name: `${TEVM_PREFIX}config`,
      storage: createJSONStorage(() => localStorage),
      partialize: (state: ConfigStore) => ({
        caller: state.caller,
        skipBalance: state.skipBalance,
      }),
      onRehydrateStorage: () => async (state, error) => {
        if (error) console.error("Failed to rehydrate config store:", error);
        if (!state) return;

        const { hydrate } = state;
        hydrate();
      },
    },
  ),
);
