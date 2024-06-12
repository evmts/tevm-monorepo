import type { InvalidAddressError, InternalError, InvalidParamsError } from '@tevm/errors'

export type TevmDumpStateError = InternalError | InvalidAddressError | InvalidParamsError
