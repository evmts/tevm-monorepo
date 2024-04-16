/**
 * Generic error for when params to a `createFoo` are wrong
 */
export class InvalidCreateParams extends Error {
  /**
   * @type {'InvalidCreateParams'}
   * @override
   */
  name = 'InvalidCreateParams'
  /**
   * @type {'InvalidCreateParams'}
   */
  _tag = 'InvalidCreateParams'
}
