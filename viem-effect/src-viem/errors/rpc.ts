import type { Prettify } from '../types/utils.js'
import { BaseError } from './base.js'
import { RpcRequestError } from './request.js'

const unknownErrorCode = -1

export type RpcErrorCode =
  | -1
  | -32700 // Parse error
  | -32600 // Invalid request
  | -32601 // Method not found
  | -32602 // Invalid params
  | -32603 // Internal error
  | -32000 // Invalid input
  | -32001 // Resource not found
  | -32002 // Resource unavailable
  | -32003 // Transaction rejected
  | -32004 // Method not supported
  | -32005 // Limit exceeded
  | -32006 // JSON-RPC version not supported
  | -32042 // Method not found

type RpcErrorOptions<TCode extends number = RpcErrorCode> = {
  code?: TCode | (number & {})
  docsPath?: string
  metaMessages?: string[]
  shortMessage: string
}

/**
 * Error subclass implementing JSON RPC 2.0 errors and Ethereum RPC errors per EIP-1474.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1474
 */
export type RpcErrorType = RpcError & { name: 'RpcError' }
export class RpcError<TCode extends number = RpcErrorCode> extends BaseError {
  override name = 'RpcError'

  code: TCode | (number & {})

  constructor(
    cause: Error,
    { code, docsPath, metaMessages, shortMessage }: RpcErrorOptions<TCode>,
  ) {
    super(shortMessage, {
      cause,
      docsPath,
      metaMessages:
        metaMessages || (cause as { metaMessages?: string[] })?.metaMessages,
    })
    this.name = cause.name
    this.code = (
      cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode
    ) as TCode
  }
}

export type ProviderRpcErrorCode =
  | 4001 // User Rejected Request
  | 4100 // Unauthorized
  | 4200 // Unsupported Method
  | 4900 // Disconnected
  | 4901 // Chain Disconnected
  | 4902 // Chain Not Recognized

/**
 * Error subclass implementing Ethereum Provider errors per EIP-1193.
 *
 * - EIP https://eips.ethereum.org/EIPS/eip-1193
 */
export type ProviderRpcErrorType = ProviderRpcError & {
  name: 'ProviderRpcError'
}
export class ProviderRpcError<
  T = undefined,
> extends RpcError<ProviderRpcErrorCode> {
  override name = 'ProviderRpcError'

  data?: T

  constructor(
    cause: Error,
    options: Prettify<
      RpcErrorOptions<ProviderRpcErrorCode> & {
        data?: T
      }
    >,
  ) {
    super(cause, options)

    this.data = options.data
  }
}

/**
 * Subclass for a "Parse error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type ParseRpcErrorType = ParseRpcError & {
  code: -32700
  name: 'ParseRpcError'
}
export class ParseRpcError extends RpcError {
  override name = 'ParseRpcError'
  static code = -32700 as const

  constructor(cause: Error) {
    super(cause, {
      code: ParseRpcError.code,
      shortMessage:
        'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.',
    })
  }
}

/**
 * Subclass for a "Invalid request" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type InvalidRequestRpcErrorType = InvalidRequestRpcError & {
  code: -32600
  name: 'InvalidRequestRpcError'
}
export class InvalidRequestRpcError extends RpcError {
  override name = 'InvalidRequestRpcError'
  static code = -32600 as const

  constructor(cause: Error) {
    super(cause, {
      code: InvalidRequestRpcError.code,
      shortMessage: 'JSON is not a valid request object.',
    })
  }
}

/**
 * Subclass for a "Method not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type MethodNotFoundRpcErrorType = MethodNotFoundRpcError & {
  code: -32601
  name: 'MethodNotFoundRpcError'
}
export class MethodNotFoundRpcError extends RpcError {
  override name = 'MethodNotFoundRpcError'
  static code = -32601 as const

  constructor(cause: Error) {
    super(cause, {
      code: MethodNotFoundRpcError.code,
      shortMessage: 'The method does not exist / is not available.',
    })
  }
}

/**
 * Subclass for an "Invalid params" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type InvalidParamsRpcErrorType = InvalidParamsRpcError & {
  code: -32602
  name: 'InvalidParamsRpcError'
}
export class InvalidParamsRpcError extends RpcError {
  override name = 'InvalidParamsRpcError'
  static code = -32602 as const

  constructor(cause: Error) {
    super(cause, {
      code: InvalidParamsRpcError.code,
      shortMessage: [
        'Invalid parameters were provided to the RPC method.',
        'Double check you have provided the correct parameters.',
      ].join('\n'),
    })
  }
}

/**
 * Subclass for an "Internal error" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type InternalRpcErrorType = InternalRpcError & {
  code: -32603
  name: 'InternalRpcError'
}
export class InternalRpcError extends RpcError {
  override name = 'InternalRpcError'
  static code = -32603 as const

  constructor(cause: Error) {
    super(cause, {
      code: InternalRpcError.code,
      shortMessage: 'An internal error was received.',
    })
  }
}

/**
 * Subclass for an "Invalid input" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type InvalidInputRpcErrorType = InvalidInputRpcError & {
  code: -32000
  name: 'InvalidInputRpcError'
}
export class InvalidInputRpcError extends RpcError {
  override name = 'InvalidInputRpcError'
  static code = -32000 as const

  constructor(cause: Error) {
    super(cause, {
      code: InvalidInputRpcError.code,
      shortMessage: [
        'Missing or invalid parameters.',
        'Double check you have provided the correct parameters.',
      ].join('\n'),
    })
  }
}

/**
 * Subclass for a "Resource not found" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type ResourceNotFoundRpcErrorType = ResourceNotFoundRpcError & {
  code: -32001
  name: 'ResourceNotFoundRpcError'
}
export class ResourceNotFoundRpcError extends RpcError {
  override name = 'ResourceNotFoundRpcError'
  static code = -32001 as const

  constructor(cause: Error) {
    super(cause, {
      code: ResourceNotFoundRpcError.code,
      shortMessage: 'Requested resource not found.',
    })
  }
}

/**
 * Subclass for a "Resource unavailable" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type ResourceUnavailableRpcErrorType = ResourceUnavailableRpcError & {
  code: -32002
  name: 'ResourceUnavailableRpcError'
}
export class ResourceUnavailableRpcError extends RpcError {
  override name = 'ResourceUnavailableRpcError'
  static code = -32002 as const

  constructor(cause: Error) {
    super(cause, {
      code: ResourceUnavailableRpcError.code,
      shortMessage: 'Requested resource not available.',
    })
  }
}

/**
 * Subclass for a "Transaction rejected" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type TransactionRejectedRpcErrorType = TransactionRejectedRpcError & {
  code: -32003
  name: 'TransactionRejectedRpcError'
}
export class TransactionRejectedRpcError extends RpcError {
  override name = 'TransactionRejectedRpcError'
  static code = -32003 as const

  constructor(cause: Error) {
    super(cause, {
      code: TransactionRejectedRpcError.code,
      shortMessage: 'Transaction creation failed.',
    })
  }
}

/**
 * Subclass for a "Method not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type MethodNotSupportedRpcErrorType = MethodNotSupportedRpcError & {
  code: -32004
  name: 'MethodNotSupportedRpcError'
}
export class MethodNotSupportedRpcError extends RpcError {
  override name = 'MethodNotSupportedRpcError'
  static code = -32004 as const

  constructor(cause: Error) {
    super(cause, {
      code: MethodNotSupportedRpcError.code,
      shortMessage: 'Method is not implemented.',
    })
  }
}

/**
 * Subclass for a "Limit exceeded" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type LimitExceededRpcErrorType = LimitExceededRpcError & {
  code: -32005
  name: 'LimitExceededRpcError'
}
export class LimitExceededRpcError extends RpcError {
  override name = 'LimitExceededRpcError'
  static code = -32005 as const

  constructor(cause: Error) {
    super(cause, {
      code: LimitExceededRpcError.code,
      shortMessage: 'Request exceeds defined limit.',
    })
  }
}

/**
 * Subclass for a "JSON-RPC version not supported" EIP-1474 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1474#error-codes
 */
export type JsonRpcVersionUnsupportedErrorType =
  JsonRpcVersionUnsupportedError & {
    code: -32006
    name: 'JsonRpcVersionUnsupportedError'
  }
export class JsonRpcVersionUnsupportedError extends RpcError {
  override name = 'JsonRpcVersionUnsupportedError'
  static code = -32006 as const

  constructor(cause: Error) {
    super(cause, {
      code: JsonRpcVersionUnsupportedError.code,
      shortMessage: 'Version of JSON-RPC protocol is not supported.',
    })
  }
}

/**
 * Subclass for a "User Rejected Request" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export type UserRejectedRequestErrorType = UserRejectedRequestError & {
  code: 4001
  name: 'UserRejectedRequestError'
}
export class UserRejectedRequestError extends ProviderRpcError {
  override name = 'UserRejectedRequestError'
  static code = 4001 as const

  constructor(cause: Error) {
    super(cause, {
      code: UserRejectedRequestError.code,
      shortMessage: 'User rejected the request.',
    })
  }
}

/**
 * Subclass for an "Unauthorized" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export type UnauthorizedProviderErrorType = UnauthorizedProviderError & {
  code: 4100
  name: 'UnauthorizedProviderError'
}
export class UnauthorizedProviderError extends ProviderRpcError {
  override name = 'UnauthorizedProviderError'
  static code = 4100 as const

  constructor(cause: Error) {
    super(cause, {
      code: UnauthorizedProviderError.code,
      shortMessage:
        'The requested method and/or account has not been authorized by the user.',
    })
  }
}

/**
 * Subclass for an "Unsupported Method" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export type UnsupportedProviderMethodErrorType =
  UnsupportedProviderMethodError & {
    code: 4200
    name: 'UnsupportedProviderMethodError'
  }
export class UnsupportedProviderMethodError extends ProviderRpcError {
  override name = 'UnsupportedProviderMethodError'
  static code = 4200 as const

  constructor(cause: Error) {
    super(cause, {
      code: UnsupportedProviderMethodError.code,
      shortMessage: 'The Provider does not support the requested method.',
    })
  }
}

/**
 * Subclass for an "Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export type ProviderDisconnectedErrorType = ProviderDisconnectedError & {
  code: 4900
  name: 'ProviderDisconnectedError'
}
export class ProviderDisconnectedError extends ProviderRpcError {
  override name = 'ProviderDisconnectedError'
  static code = 4900 as const

  constructor(cause: Error) {
    super(cause, {
      code: ProviderDisconnectedError.code,
      shortMessage: 'The Provider is disconnected from all chains.',
    })
  }
}

/**
 * Subclass for an "Chain Disconnected" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export type ChainDisconnectedErrorType = ChainDisconnectedError & {
  code: 4901
  name: 'ChainDisconnectedError'
}
export class ChainDisconnectedError extends ProviderRpcError {
  override name = 'ChainDisconnectedError'
  static code = 4901 as const

  constructor(cause: Error) {
    super(cause, {
      code: ChainDisconnectedError.code,
      shortMessage: 'The Provider is not connected to the requested chain.',
    })
  }
}

/**
 * Subclass for an "Switch Chain" EIP-1193 error.
 *
 * EIP https://eips.ethereum.org/EIPS/eip-1193#provider-errors
 */
export type SwitchChainErrorType = SwitchChainError & {
  code: 4902
  name: 'SwitchChainError'
}
export class SwitchChainError extends ProviderRpcError {
  override name = 'SwitchChainError'
  static code = 4902 as const

  constructor(cause: Error) {
    super(cause, {
      code: SwitchChainError.code,
      shortMessage: 'An error occurred when attempting to switch chain.',
    })
  }
}

/**
 * Subclass for an unknown RPC error.
 */
export type UnknownRpcErrorType = UnknownRpcError & {
  name: 'UnknownRpcError'
}
export class UnknownRpcError extends RpcError {
  override name = 'UnknownRpcError'

  constructor(cause: Error) {
    super(cause, {
      shortMessage: 'An unknown RPC error occurred.',
    })
  }
}
