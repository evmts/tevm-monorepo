import type { InternalError, InvalidAddressError, InvalidParamsError } from '@tevm/errors'

export type TevmDumpStateError = InternalError | InvalidAddressError | InvalidParamsError
