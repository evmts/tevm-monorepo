import { Effect } from 'effect'
import Ox from 'ox'

// Re-export types
export type Siwe = Ox.Siwe.Siwe
export type Message = Ox.Siwe.Message
export type CreateMessageParams = Ox.Siwe.CreateMessageParams
export type VerifyMessageParams = Ox.Siwe.VerifyMessageParams

/**
 * Error thrown when creating a SIWE message
 */
export class CreateMessageError extends Error {
  override name = 'CreateMessageError'
  _tag = 'CreateMessageError'
  constructor(cause: unknown) {
    super('Error creating SIWE message with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Create a SIWE (Sign-In with Ethereum) message
 * 
 * @param params - Parameters for creating the message
 * @returns Effect that succeeds with a SIWE message
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Siwe from '@tevm/ox/siwe'
 * 
 * const params = {
 *   domain: 'example.com',
 *   address: '0x0000000000000000000000000000000000000000',
 *   statement: 'Sign in with Ethereum',
 *   uri: 'https://example.com/login',
 *   version: '1',
 *   chainId: 1,
 *   nonce: '123456789',
 * }
 * 
 * const program = Siwe.createMessage(params)
 * const message = await Effect.runPromise(program)
 * ```
 */
export function createMessage(
  params: CreateMessageParams,
): Effect.Effect<Message, CreateMessageError, never> {
  return Effect.try({
    try: () => Ox.Siwe.createMessage(params),
    catch: (cause) => new CreateMessageError(cause),
  })
}

/**
 * Error thrown when verifying a SIWE message
 */
export class VerifyMessageError extends Error {
  override name = 'VerifyMessageError'
  _tag = 'VerifyMessageError'
  constructor(cause: unknown) {
    super('Error verifying SIWE message with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Verify a SIWE (Sign-In with Ethereum) message
 * 
 * @param params - Parameters for verifying the message
 * @returns Effect that succeeds with a boolean indicating if the message is valid
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Siwe from '@tevm/ox/siwe'
 * 
 * const params = {
 *   message: siweMessage, // Message object from createMessage or parseMessage
 *   signature: '0x...',   // Signature from wallet
 *   time: new Date(),     // Optional time to check expiration
 * }
 * 
 * const program = Siwe.verifyMessage(params)
 * const isValid = await Effect.runPromise(program)
 * ```
 */
export function verifyMessage(
  params: VerifyMessageParams,
): Effect.Effect<boolean, VerifyMessageError, never> {
  return Effect.try({
    try: () => Ox.Siwe.verifyMessage(params),
    catch: (cause) => new VerifyMessageError(cause),
  })
}

/**
 * Error thrown when parsing a SIWE message
 */
export class ParseMessageError extends Error {
  override name = 'ParseMessageError'
  _tag = 'ParseMessageError'
  constructor(cause: unknown) {
    super('Error parsing SIWE message with ox', {
      cause: cause instanceof Error ? cause : undefined,
    })
  }
}

/**
 * Parse a SIWE (Sign-In with Ethereum) message
 * 
 * @param message - SIWE message string to parse
 * @returns Effect that succeeds with a SIWE message object
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Siwe from '@tevm/ox/siwe'
 * 
 * const messageString = 'example.com wants you to sign in with your Ethereum account:\n0x0000000000000000000000000000000000000000\n\nSign in with Ethereum\n\nURI: https://example.com/login\nVersion: 1\nChain ID: 1\nNonce: 123456789\nIssued At: 2023-01-01T00:00:00.000Z'
 * 
 * const program = Siwe.parseMessage(messageString)
 * const message = await Effect.runPromise(program)
 * ```
 */
export function parseMessage(
  message: string,
): Effect.Effect<Message, ParseMessageError, never> {
  return Effect.try({
    try: () => Ox.Siwe.parseMessage(message),
    catch: (cause) => new ParseMessageError(cause),
  })
}