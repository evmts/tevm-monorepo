import { createStash } from "@latticexyz/stash/internal";
import { createSyncAdapter } from "@latticexyz/store-sync/internal";
import config from "contracts/mud.config";

export const stash = createStash(config);
export const syncAdapter = createSyncAdapter({ stash });
