import type { InvalidRequestError } from '@tevm/errors'
import type { TevmCallError } from '../Call/TevmCallError.js'
import type { TevmSetAccountError } from '../SetAccount/TevmSetAccountError.js'

export type TevmScriptError = TevmCallError | TevmSetAccountError | InvalidRequestError
