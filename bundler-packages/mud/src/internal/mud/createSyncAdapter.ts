import { getRecord, setRecord, registerTable, type Stash } from "@latticexyz/stash/internal";
import { createStorageAdapter } from "./createStorageAdapter.js";
import { SyncStep, type SyncAdapter, createStoreSync } from "@latticexyz/store-sync";
import { SyncProgress } from "@latticexyz/store-sync/internal";
import { applyStashUpdates, notifyStashSubscribers } from "./applyUpdates.js";
import type { Hex } from "viem";

export type CreateSyncAdapterOptions = {
  stash: Stash
  onTx?: ((tx: { hash: Hex | undefined }) => Promise<void>) | undefined
};

export function createSyncAdapter({ stash, onTx }: CreateSyncAdapterOptions): SyncAdapter {
  return (opts) => {
    // TODO: clear stash?

    registerTable({ stash, table: SyncProgress });

    const storageAdapter = createStorageAdapter({ stash, onTx });

    return createStoreSync({
      ...opts,
      storageAdapter: async (block) => {
        const updates = await storageAdapter(block);
        applyStashUpdates({ stash, updates });
        queueMicrotask(() => {
          notifyStashSubscribers({ stash, updates });
        })
      },
      onProgress: (nextValue) => {
        const currentValue = getRecord({ stash, table: SyncProgress, key: {} });
        // update sync progress until we're caught up and live
        if (currentValue?.step !== SyncStep.LIVE) {
          setRecord({ stash, table: SyncProgress, key: {}, value: nextValue });
        }
      },
    });
  };
}