import config from "contracts/mud.config";
import { createSyncAdapter } from "@latticexyz/store-sync/internal";
import { createStash } from "@latticexyz/stash/internal";

export const stash = createStash(config)

export const syncAdapter = createSyncAdapter({ stash })