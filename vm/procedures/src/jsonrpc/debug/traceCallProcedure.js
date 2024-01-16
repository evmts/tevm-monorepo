import { hexToBigInt } from 'viem'
import { traceCallHandler } from '../../handlers/debug/traceCallHandler.js'

/**
 * Creates an debug_traceCall JSON-RPC Procedure for handling account requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').DebugTraceCallProcedure}
 */
export const traceCallProcedure = (evm) => async (request) => {
  request.params.block
  request.params.transaction.gas
  const { errors = [], ...result } = await traceCallHandler({ evm })({
    ...request.params,
  })
  if (errors.length > 0) {
    const error = /** @type {import('@tevm/api').AccountError}*/ (errors[0])
    return {
      jsonrpc: '2.0',
      error: {
        code: error._tag,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message),
        },
      },
      method: 'tevm_account',
      ...(request.id === undefined ? {} : { id: request.id }),
    }
  }
  return {
    jsonrpc: '2.0',
    result,
    method: 'tevm_account',
    ...(request.id === undefined ? {} : { id: request.id }),
  }
}
