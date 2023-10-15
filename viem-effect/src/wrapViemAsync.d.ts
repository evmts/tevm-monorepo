import { Effect } from "effect"
import type { AnyAsyncFunction } from "./types.js"

export type WrapViemAsync = <
  TViemFunction extends AnyAsyncFunction,
  TErrorType extends Error
>(viemFunction: TViemFunction) => <TParams extends Parameters<TViemFunction>>(...args: TParams) => Effect.Effect<never, TErrorType, ReturnType<TViemFunction>>

export const wrapViemAsync: WrapViemAsync
