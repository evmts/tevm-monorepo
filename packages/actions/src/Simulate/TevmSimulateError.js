/**
 * @module TevmSimulateError
 */

import { TevmError } from '@tevm/errors'

/**
 * Error class for simulate errors
 * @class
 * @extends TevmError
 */
export class TevmSimulateError extends TevmError {
  name = 'TevmSimulateError'
  /**
   * @param {object} options - Error options
   * @param {string} options.message - Error message
   * @param {import('../../types/SimulateParams.js').SimulateParams} [options.params] - The parameters that caused the error
   * @param {Error} [options.cause] - The underlying error that caused this error
   */
  constructor({ message, params, cause }) {
    super(message, { cause })
    this.params = params
  }
}