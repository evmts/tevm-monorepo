import * as fs from 'node:fs'
import * as path from 'node:path'

type ErrorDefinition = {
	name: string
	message: string
	code: number
}

const errors = [
	{
		name: 'ParseError',
		message: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
		code: -32700,
	},
	{ name: 'InvalidRequest', message: 'The JSON sent is not a valid Request object.', code: -32600 },
	{ name: 'MethodNotFound', message: 'The method does not exist or is not available.', code: -32601 },
	{ name: 'InvalidParams', message: 'Invalid method parameter(s).', code: -32602 },
	{ name: 'InternalError', message: 'Internal JSON-RPC error.', code: -32603 },
	{ name: 'ExecutionError', message: 'An execution error occurred on the Ethereum node.', code: -32015 },
	{ name: 'OutOfGas', message: 'Transaction ran out of gas.', code: -32015 },
	{ name: 'InvalidOpcode', message: 'Transaction contained an invalid opcode.', code: -32015 },
	{ name: 'Revert', message: 'Transaction execution reverted.', code: 3 },
	{ name: 'ResourceNotFound', message: 'Requested resource was not found on the Ethereum node.', code: -32001 },
	{ name: 'AccountNotFoundError', message: 'The requested account could not be found.', code: -32001 },
	{ name: 'ResourceUnavailable', message: 'Requested resource is temporarily unavailable.', code: -32002 },
	{ name: 'TransactionRejected', message: 'The transaction was rejected by the node.', code: -32003 },
	{ name: 'MethodNotSupported', message: 'The requested method is not supported by the Ethereum node.', code: -32004 },
	{ name: 'LimitExceeded', message: 'Request limit exceeded.', code: -32005 },
	{ name: 'NonceTooLow', message: 'Nonce value is too low.', code: -32003 },
	{ name: 'NonceTooHigh', message: 'Nonce value is too high.', code: -32003 },
	{ name: 'InsufficientFunds', message: 'Insufficient funds for the transaction.', code: -32003 },
	{ name: 'GasLimitExceeded', message: 'Gas limit exceeded.', code: -32000 },
	{ name: 'ChainIdMismatch', message: 'Chain ID does not match.', code: -32003 },
	{ name: 'InvalidSignature', message: 'Invalid signature.', code: -32003 },
	{ name: 'UnknownBlock', message: 'The specified block could not be found.', code: -32001 },
	{
		name: 'PendingTransactionTimeout',
		message: 'The transaction is still pending and has not been included in a block.',
		code: -32002,
	},
	{ name: 'InvalidTransaction', message: 'The transaction is invalid.', code: -32003 },
	{ name: 'ContractExecutionFailed', message: 'Execution of the contract failed.', code: -32015 },
	{ name: 'AccountLocked', message: 'The account is locked.', code: -32020 },
	{ name: 'BlockGasLimitExceeded', message: 'The block gas limit has been exceeded.', code: -32006 },
	{ name: 'UnsupportedChain', message: 'The specified chain is not supported.', code: -32007 },
	{ name: 'NonceAlreadyUsed', message: 'The specified nonce has already been used.', code: -32008 },
	{ name: 'InsufficientPermissions', message: 'Insufficient permissions for the requested operation.', code: -32009 },
	{ name: 'RateLimitExceeded', message: 'Request limit exceeded.', code: -32005 },
	{ name: 'TransactionTooLarge', message: 'The transaction is too large.', code: -32011 },
	{ name: 'InvalidGasPrice', message: 'The specified gas price is invalid.', code: -32012 },
	{ name: 'InvalidAddress', message: 'The specified address is invalid.', code: -32013 },
	{ name: 'TransactionUnderpriced', message: 'The transaction gas price is too low.', code: -32014 },
] satisfies ErrorDefinition[]

const outputDir = './errors'
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir)
}

errors.forEach((error) => {
	const content = `/**
 * ${error.name} Error
 *
 * @type {TypedError<'${error.name}'>}
 * @property {string} _tag - Same as name, used internally
 * @property {string} name - The name of the error, analogous to code in JSON RPC
 * @property {string} message - Human-readable error message
 * @property {object} [meta] - Optional object containing additional information about the error
 * @property {number} code - Error code analogous to the code in JSON RPC error
 */
export const ${error.name}Error: TypedError<'${error.name}'> = {
  _tag: '${error.name}',
  name: '${error.name}',
  message: '${error.message}',
  code: ${error.code}
};
`

	fs.writeFileSync(path.join(outputDir, `${error.name}Error.ts`), content, 'utf8')
})

console.log('Error files generated successfully.')
