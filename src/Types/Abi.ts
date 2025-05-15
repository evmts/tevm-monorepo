import { Schema } from "effect/index";

export type Abi = import("abitype").Abi;
export const Abi = Schema.Any; // TODO

export type HumanReadableAbi = ReadonlyArray<string>;
export const HumanReadableAbi = Schema.Any; // TODO
