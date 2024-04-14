/**
 * Error thrown when a request is made with an unknown method
 */
export class UnknownMethodError extends Error {
  /**
   * @type {'UnknownMethodError'}
   * @override
   */
  name = 'UnknownMethodError'
  /**
   * @type {'UnknownMethodError'}
   */
  _tag = 'UnknownMethodError'
  /**
   * @param {never} request a request that must be of type `never` such that all valid requests are handled
   */
  constructor(request) {
    super(`Unknown method in request: ${JSON.stringify(request)}`)
  }
}
