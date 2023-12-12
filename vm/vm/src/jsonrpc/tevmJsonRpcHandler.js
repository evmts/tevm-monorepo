import { tevmContractCall } from './contractCall/tevmContractCall.js'
import { tevmPutAccount } from './putAccount/tevmPutAccount.js'
import { tevmPutContractCode } from './putContractCode/tevmPutContractCode.js'
import { tevmCall } from './runCall/tevmCall.js'
import { tevmScript } from './runScript/tevmScript.js'

/**
 * @param {import('../tevm.js').Tevm} vm
 */
export const tevmJsonRpcHandler = async (vm) => {
  /**
   * @param {import('./TevmJsonRpcRequest.js').TevmJsonRpcRequest} request
   */
  const handler = async (request) => {
    switch (request.method) {
      case 'tevm_call':
        return tevmCall(vm, request)
      case 'tevm_putContractCode':
        return tevmPutContractCode(vm, request)
      case 'tevm_putAccount':
        return tevmPutAccount(vm, request)
      case 'tevm_contractCall':
        return tevmContractCall(vm, request)
      case 'tevm_script':
        return tevmScript(vm, request)
      default:
        neverThrow(request)
    }
  }
}

/**
 * @param {never} param
 */
const neverThrow = async (param) => {
  console.error(param)
  throw new Error("Unexpected internal error occured")
}
