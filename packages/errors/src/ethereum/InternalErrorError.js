// Ideally we get this from viem
import { BaseError } from './BaseError.js'

/**
* Parameters for constructing an InternalError.
* @typedef {Object} InternalErrorParameters
* @property {string} [docsBaseUrl] - Base URL for the documentation.
* @property {string} [docsPath] - Path to the documentation.
* @property {string} [docsSlug] - Slug for the documentation.
* @property {string[]} [metaMessages] - Additional meta messages.
* @property {BaseError|Error|unknown} [cause] - The cause of the error.
* @property {string} [details] - Details of the error.
* @property {object} [meta] - Optional object containing additional information about the error.
*/

/**
* Represents an internal JSON-RPC error.
*
* This error is typically encountered when there is an internal error on the server.
*
* @example
* try {
*   // Some operation that can throw an InternalError
* } catch (error) {
*   if (error instanceof InternalError) {
*     console.error(error.message);
*     // Handle the internal error
*   }
* }
*
* @param {string} message - A human-readable error message.
* @param {InternalErrorParameters} [args={}] - Additional parameters for the BaseError.
* @property {'InternalError'} _tag - Same as name, used internally.
* @property {'InternalError'} name - The name of the error, used to discriminate errors.
* @property {string} message - Human-readable error message.
* @property {object} [meta] - Optional object containing additional information about the error.
* @property {number} code - Error code, analogous to the code in JSON RPC error.
* @property {string} docsPath - Path to the documentation for this error.
* @property {string[]} [metaMessages] - Additional meta messages for more context.
*/
export class InternalError extends BaseError {
/**
* Constructs an InternalError.
*
* @param {string} message - Human-readable error message.
* @param {InternalErrorParameters} [args={}] - Additional parameters for the BaseError.
*/
constructor(message, args = {}) {
super(
message,
{
...args,
docsBaseUrl: 'https://tevm.sh',
docsPath: '/reference/tevm/errors/classes/internalerror/',
},
'InternalError',
-32603,
)

/**
* @type {object|undefined}
*/
this.meta = args.meta
}

/**
* @type {'InternalError'}
* @override
*/
_tag = 'InternalError'

/**
* @type {'InternalError'}
* @override
*/
name = 'InternalError'
}
