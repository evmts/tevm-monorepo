import { Effect } from "effect"
import type { AnySyncFunction } from "./types.js"

export type WrapViemSync = <
  TViemFunction extends AnySyncFunction,
  TErrorType extends Error
>(viemFunction: TViemFunction) => WrapedViemFunction<TViemFunction, TErrorType>

export type WrapedViemFunction<TViemFunction extends AnySyncFunction, TErrorType extends Error> = <TParams extends Parameters<TViemFunction>>(...args: TParams) => Effect.Effect<never, TErrorType, ReturnType<TViemFunction>>

export const wrapViemSync: WrapViemSync
