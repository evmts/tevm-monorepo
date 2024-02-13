import { createTransport } from 'viem'

/**
 * @param {import('@tevm/procedures-types').TevmJsonRpcRequestHandler} tevmRequest The `request` property on a `Tevm` instance
 * @param {Pick<import('viem').TransportConfig, 'name' | 'key'>} [options]
 * @returns {import('viem').Transport} The transport function
 */
export const tevmTransport = (tevmRequest, options) => {
  /**
   * EIP-1193 request function
   * @type {import('viem').EIP1193RequestFn}
   */
  const requestFn = async ({ method, params }) => {

    const res = await tevmRequest({
      jsonrpc: '2.0',
      method: /** @type {any}*/(method),
      params: /** @type {any}*/(params),
    })
    if (res.error) {
      throw res.error
    }
    return res.result
  }
  return () => {
    return createTransport({
      request: requestFn,
      type: 'tevm',
      name: options?.name ?? 'Tevm transport',
      key: options?.key ?? 'tevm',
    })
  }
}
