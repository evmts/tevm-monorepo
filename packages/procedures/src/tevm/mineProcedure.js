import { mineHandler } from '@tevm/actions'

/**
 * Creates an Mine JSON-RPC Procedure for handling tevm_mine requests with Ethereumjs VM
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/procedures-types').MineJsonRpcProcedure}
 */
export const mineProcedure = (client) => async (request) => {
  const { errors = [], ...result } = await mineHandler(client)({
    throwOnFail: false,
    ...request.params[0],
  })
  if (errors.length > 0) {
    const error = /** @type {import('@tevm/errors').MineError}*/ (
      errors[0]
    )
    return {
      jsonrpc: '2.0',
      error: {
        // TODO type this
        code: 400,// error._tag,
        message: error.message,
        data: {
          errors: errors.map(({ message }) => message),
        },
      },
      method: 'tevm_mine',
      ...(request.id === undefined ? {} : { id: request.id }),
    }
  }
  return {
    jsonrpc: '2.0',
    result,
    method: 'tevm_mine',
    ...(request.id === undefined ? {} : { id: request.id }),
  }
}
