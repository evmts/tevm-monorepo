import type { InternalError, InvalidAddressError, InvalidParamsError, InvalidRequestError } from '@tevm/errors'

export type TevmMineError = InternalError | InvalidAddressError | InvalidParamsError | InvalidRequestError
