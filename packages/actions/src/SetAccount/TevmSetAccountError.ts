import type { InternalError, InvalidAddressError } from '@tevm/errors'
import type { ValidateSetAccountParamsError } from './validateSetAccountParams.js'

export type TevmSetAccountError = ValidateSetAccountParamsError | InternalError | InvalidAddressError
