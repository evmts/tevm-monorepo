/**
 * Internal utility to wrap a handler and handle the `throwOnError` option.
 * If `throwOnError` is true and the handler returns an `errors` array, it will throw an error.
 * Otherwise, it will return the result of the handler.
 * @type {import('./throwOnErrorProxy.types.js').ThrowOnProxy}
 */
export const throwOnErrorProxy = (handler) => {
  /**
   * @param {any} params
   */
  const wrappedHandler = async (params) => {
    const result = await handler(params);
    if (!params.throwOnError) {
      return result;
    }
    if (result?.errors?.length === 1) {
      throw result.errors[0];
    }
    if (result?.errors?.length > 1) {
      throw new AggregateError(result.errors);
    }
    return result;
  }
  return /**@type {any}*/(wrappedHandler)
}
