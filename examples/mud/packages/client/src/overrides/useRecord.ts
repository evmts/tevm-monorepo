/**
 * Copied from @latticexyz/stash/react to use deepEqual instead of shallow equal and prevent infinite re-renders.
 * @see https://github.com/latticexyz/mud/blob/main/packages/stash/src/react/useRecord.ts
 */
import { type Table } from "@latticexyz/config";
import { type TableRecord, type Stash, type Key, getRecord } from "@latticexyz/stash/internal";
import { useStash } from "./useStash.js";

export type UseRecordOptions<
  table extends Table = Table,
  defaultValue extends Omit<TableRecord<table>, keyof Key<table>> | undefined = undefined,
> = {
  stash: Stash;
  table: table;
  key: Key<table>;
  defaultValue?: defaultValue;
};

export type UseRecordResult<
  table extends Table = Table,
  defaultValue extends Omit<TableRecord<table>, keyof Key<table>> | undefined = undefined,
> = defaultValue extends undefined ? TableRecord<table> | undefined : TableRecord<table>;

export function useRecord<
  const table extends Table,
  const defaultValue extends Omit<TableRecord<table>, keyof Key<table>> | undefined = undefined,
>({ stash, ...args }: UseRecordOptions<table, defaultValue>): UseRecordResult<table, defaultValue> {
  return useStash(stash, (state) => getRecord({ state, ...args }));
}