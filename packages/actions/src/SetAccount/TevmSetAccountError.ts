import type { InternalError } from '@tevm/errors'
import type { ValidateSetAccountParamsError } from './validateSetAccountParams.js'

export type TevmSetAccountError = ValidateSetAccountParamsError | InternalError
