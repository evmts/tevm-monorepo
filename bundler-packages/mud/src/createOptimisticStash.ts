import {  extend, type MutableState, type Stash, type StoreConfig, type StoreSubscribers, type TableSubscribers } from "@latticexyz/stash/internal";
import { type Table } from "@latticexyz/store/internal";
import { createStorageAdapter } from "@latticexyz/store-sync/internal"
import type { MemoryClient } from "@tevm/memory-client";
import { type DefaultActions, defaultActions } from "./internal/defaultActions.js";
import { subscribePendingLogs } from "./internal/subscribePendingLogs.js";
import type { StoreEventsLog } from "@latticexyz/store-sync";

export type Config = StoreConfig;

export type CreateStashResult<config extends Config = Config> = Stash<config> & DefaultActions<config>;

/**
 * Initializes a Stash based on the provided store config.
 *
 * Note: this is a modified version of `createStash`, that uses the optimistic state on top of the canonical state by
 * applying the txs in the transaction pool on top of the canonical state when `get` is called.
 *
 * A few things to note:
 * - Subscribers will be notified on canonical state changes (as per the initial design) AND on optimistic state changes,
 * or more accurately whenever the pending logs are updated, it will stream updates for each of these.
 * - BUT these updates should not be considered the "source of truth" for the state, as `get` is; if the canonical state changes,
 * an update will be streamed, but we won't stream updates again for the unchanged optimistic state that lives on top of it. Meaning that this
 * update that is received might not reflect the latest optimistic state.
 * - Basically, subscriptions should be considered a notification that the state has changed, and should be fetched again with `get`.
 * This is precisely what React hooks do, so nothing to worry about there.
 */
export const createOptimisticStash = <config extends Config>(memoryClient: MemoryClient) => (storeConfig?: config): CreateStashResult<config> => {
  const tableSubscribers: TableSubscribers = {};
  const storeSubscribers: StoreSubscribers = new Set();

  const canonicalState: MutableState = {
    config: {},
    records: {},
  };

  // Initialize the stash
  if (storeConfig) {
    for (const [namespace, { tables }] of Object.entries(storeConfig.namespaces)) {
      for (const [table, fullTableConfig] of Object.entries(tables)) {
        // Remove unused artifacts from the stash config
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { deploy, codegen, ...tableConfig } = { ...(fullTableConfig as Table) };

        // Set config for tables
        (canonicalState.config[namespace] ??= {})[table] = tableConfig;

        // Init records map for tables
        (canonicalState.records[namespace] ??= {})[table] = {};

        // Init subscribers set for tables
        (tableSubscribers[namespace] ??= {})[table] ??= new Set();
      }
    }
  }

  // Adds the optimistic state on top of the canonical state by applying the logs on a deep copy of the canonical state and returning it instead
  const _computeOptimisticState = (optimisticLogs: StoreEventsLog[], notify: boolean) => {
    const optimisticState: MutableState = {
      config: canonicalState.config,
      records: structuredClone(canonicalState.records),
    };

    if (optimisticLogs.length > 0) {
      createStorageAdapter({ stash: {
        get: () => optimisticState,
        _: {
          state: optimisticState,
          tableSubscribers: notify ? tableSubscribers : {},
          storeSubscribers: notify ? storeSubscribers : new Set() as StoreSubscribers<StoreConfig>,
        },
      }})({ logs: optimisticLogs, blockNumber: 0n });
    }

    return optimisticState;
  };

  // Start tracking logs from the pending block on tx added/dropped from the pool
  let pendingLogs: StoreEventsLog[] = [];
  subscribePendingLogs(memoryClient, (logs) => {
    pendingLogs = logs;
    // Notify subscribers to trigger a re-render as the optimistic state has changed
    _computeOptimisticState(logs, true);
  });

  // Don't notify subscribers in storageAdapter, otherwise it will trigger an infinite loop in react hooks of:
  // notify -> trigger get in react hook -> storageAdapter() -> notify -> etc
  const optimisticStateView = () => _computeOptimisticState(pendingLogs, false)

  const stash = {
    get: () => optimisticStateView(),
    _: {
      state: canonicalState,
      tableSubscribers,
      storeSubscribers,
    },
  } satisfies Stash;

  return extend({ stash, actions: defaultActions(stash) }) as never;
}