// TODO strongly type this
/**
 * Errors returned by tevm_mine method
 * @example
 * const {errors} = await tevm.mine({})
 *
 * if (errors?.length) {
 *   console.log(errors[0].message)
 * }
 */
export type MineError = Error
