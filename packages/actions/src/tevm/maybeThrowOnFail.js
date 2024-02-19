/**
 * Internal utility to wrap a handler and handle the `throwOnError` option.
 * If `throwOnError` is true and the handler returns an `errors` array, it will throw an error.
 * Otherwise, it will return the result of the handler.
 * @template {{errors?: any[]}} TResult
 * @param {boolean} throwOnFail whether to throw
 * @param {TResult} result
 * @returns {TResult extends {throwOnError: true} ? Omit<TResult, 'errors'> : TResult}
 */
export const maybeThrowOnFail = (throwOnFail, result) => {
	if (!throwOnFail) {
		return /** @type {any}*/ (result)
	}
	if ((result?.errors?.length ?? 0) === 1) {
		throw result.errors?.[0]
	}
	if ((result?.errors?.length ?? 0) > 1) {
		throw new AggregateError(result?.errors ?? [])
	}
	return /** @type {any}*/ (result)
}
