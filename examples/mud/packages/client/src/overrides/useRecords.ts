/**
 * Copied from @latticexyz/stash/react to use deepEqual instead of shallow equal and prevent infinite re-renders.
 * @see https://github.com/latticexyz/mud/blob/main/packages/stash/src/react/useRecords.ts
 */
import { type Table } from "@latticexyz/config";
import { type Key, type Stash, type TableRecord, getRecords } from "@latticexyz/stash/internal";
import { useStash } from "./useStash.js";
import { isEqual } from "lodash"

export type UseRecordsOptions<table extends Table = Table> = {
  stash: Stash;
  table: table;
  keys?: readonly Key<table>[];
};

export type UseRecordsResult<table extends Table = Table> = readonly TableRecord<table>[];

export function useRecords<const table extends Table>({
  stash,
  ...args
}: UseRecordsOptions<table>): UseRecordsResult<table> {
  return useStash(stash, (state) => Object.values(getRecords({ state, ...args })), {
    isEqual: isArrayEqual,
  });
}

function isArrayEqual(a: readonly unknown[], b: readonly unknown[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = a.length - 1; i >= 0; i--) {
    if (!isEqual(a[i], b[i])) return false;
  }
  return true;
}