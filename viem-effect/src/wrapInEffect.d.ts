import type { AnyAsyncFunction, AnyFunction } from './types.js'
import { Effect } from 'effect'

export type WrapInEffect = <
	TViemFunction extends AnyFunction,
	TErrorType extends Error,
>(
	viemFunction: TViemFunction,
) => WrappedInEffect<TViemFunction, TErrorType>

export type WrappedInEffect<
	TViemFunction extends AnyFunction,
	TErrorType extends Error,
> = <TParams extends Parameters<TViemFunction>>(
	...args: TParams
) => Effect.Effect<
	never,
	TErrorType,
	TViemFunction extends AnyAsyncFunction
		? Awaited<ReturnType<TViemFunction>>
		: ReturnType<TViemFunction>
>

export const wrapInEffect: WrapInEffect
