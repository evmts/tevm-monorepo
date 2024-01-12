import type { InvalidRequestError } from './InvalidRequestError.js'
import type { UnexpectedError } from './UnexpectedError.js'

export type LoadStateError = InvalidRequestError | UnexpectedError
