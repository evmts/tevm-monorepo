import { putContractCodeHandler } from '../../actions/putContractCode/putContractCodeHandler.js'

/**
 * @param {import('../../tevm.js').Tevm} vm
 * @param {import('./TevmPutContractCodeRequest.js').TevmPutContractCodeRequest} request
 * @returns {Promise<import('./TevmPutContractCodeResponse.js').TevmPutContractCodeResponse>}
 */
export const tevmPutContractCode = async (vm, request) => {
  return {
    jsonrpc: '2.0',
    result: await putContractCodeHandler(vm, request.params),
    method: 'tevm_putContractCode',
    ...(request.id === undefined ? {} : { id: request.id })
  }
}

