import { Block } from '@tevm/block'
import { InvalidBlockError, InvalidParamsError, UnknownBlockError } from '@tevm/errors'

/**
 * Represents possible errors that can occur during call handler options processing
 */
export type CallHandlerOptsError = UnknownBlockError | InvalidBlockError | InvalidParamsError | Block