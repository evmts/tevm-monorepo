import type { InvalidRequestError } from '@tevm/errors'
import type { TevmCallError } from '../Call/TevmCallError.js'
// TODO add ValidateDeploy type

export type TevmDeployError = TevmCallError | InvalidRequestError
