import { getRecord, setRecord, registerTable, type Stash } from "@latticexyz/stash/internal";
import { createStorageAdapter } from "./createStorageAdapter.js";
import { SyncStep, type SyncAdapter, createStoreSync } from "@latticexyz/store-sync";
import { defineTable } from "@latticexyz/store/internal";

const SyncProgress = defineTable({
  namespaceLabel: "syncToStash",
  label: "SyncProgress",
  schema: {
    step: "string",
    percentage: "uint32",
    latestBlockNumber: "uint256",
    lastBlockNumberProcessed: "uint256",
    message: "string",
  },
  key: [],
});

export type CreateSyncAdapterOptions = { stash: Stash };

export function createSyncAdapter({ stash }: CreateSyncAdapterOptions): SyncAdapter {
  return (opts) => {
    // TODO: clear stash?

    registerTable({ stash, table: SyncProgress });

    const storageAdapter = createStorageAdapter({ stash });

    return createStoreSync({
      ...opts,
      storageAdapter,
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