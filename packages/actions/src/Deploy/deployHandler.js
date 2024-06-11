import { InvalidRequestError, RevertError } from '@tevm/errors'
import { callHandler } from '../Call/callHandler.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { encodeDeployData } from '@tevm/utils'
import {
decodeErrorResult,
isHex,
} from '@tevm/utils'

// TODO let's add warnings to other calls such that if the contract is still in mempool we throw a warning telling user they need to mine a block

/**
* Creates an DeployHandler for handling deploying a contract to tevm
* @param {import('@tevm/base-client').BaseClient} client
* @param {object} [options]
* @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
* @returns {import("../Deploy/DeployHandlerType.js").DeployHandler}
*/
export const deployHandler =
(client, { throwOnFail: throwOnFailDefault = true } = {}) =>
async (params) => {
client.logger.debug(params, 'deployHandler called with params')
// TODO Moving fast atm we should ideally add validators to @tevm/zod
let deployData
try {
deployData = encodeDeployData(
				/** @type {any} */({
abi: params.abi,
bytecode: params.bytecode,
args: params.args,
}),
)
} catch (e) {
client.logger.debug(
e,
'deployHandler: Unable to encode the abi, functionName, and args into hex data',
)
const cause =/** @type {Error}*/ (e)
const err = new InvalidRequestError(cause.message, { cause })

return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, {
/**
* @type {import('@tevm/utils').Hex}
*/
rawData: '0x',
executionGasUsed: 0n,
errors: [err],
})
}

client.logger.debug(
deployData,
'deployHandler: Encoded abi bytecode and args into hex data to execute call',
)

const result = await callHandler(client, {
throwOnFail: throwOnFailDefault,
})({
...params,
// Unlike most calls deployments default to true
createTransaction: params.createTransaction !== undefined ? params.createTransaction : true,
data: deployData,
throwOnFail: false,
})

if (result.errors && result.errors.length > 0) {
result.errors = result.errors.map((err) => {
if (isHex(err.message) && err instanceof RevertError) {
try {
client.logger.debug(
err,
'contractHandler: Contract revert error. Decoding the error',
)
const decodedError = decodeErrorResult(
						/** @type {any} */({
abi: params.abi,
data: err.message,
functionName: 'constructor',
}),
)
const message = `Revert: ${decodedError.errorName} ${JSON.stringify(
decodedError,
)}`
client.logger.debug(message, 'Revert message decoded')
return new RevertError(message, { cause: /** @type any*/(err) })
} catch (e) {
client.logger.warn(e, 'Unable to decode revert data')
return err
}
}
return err
})
client.logger.debug(result.errors, 'contractHandler: Execution errors')
return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, result)
}

return maybeThrowOnFail(params.throwOnFail ?? throwOnFailDefault, result)
		}
