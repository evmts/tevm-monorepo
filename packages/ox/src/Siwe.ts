import { Effect } from 'effect'
import Ox from 'ox'

// Export types
export type Siwe = Ox.Siwe.Siwe
export type Message = Ox.Siwe.Message
export type CreateMessageParams = Ox.Siwe.CreateMessageParams
export type VerifyMessageParams = Ox.Siwe.VerifyMessageParams

/**
 * Error class for createMessage function
 */
export class CreateMessageError extends Error {
	override name = 'CreateMessageError'
	_tag = 'CreateMessageError'
	constructor(cause: unknown) {
		super('Failed to create SIWE message with ox', {
			cause,
		})
	}
}

/**
 * Creates a SIWE message
 * @param params Parameters for creating the message
 * @returns An Effect that succeeds with a SIWE message
 */
export function createMessage(params: CreateMessageParams): Effect.Effect<Message, CreateMessageError, never> {
	return Effect.try({
		try: () => Ox.Siwe.createMessage(params),
		catch: (cause) => new CreateMessageError(cause),
	})
}

/**
 * Error class for verifyMessage function
 */
export class VerifyMessageError extends Error {
	override name = 'VerifyMessageError'
	_tag = 'VerifyMessageError'
	constructor(cause: unknown) {
		super('Failed to verify SIWE message with ox', {
			cause,
		})
	}
}

/**
 * Verifies a SIWE message
 * @param params Parameters for verifying the message
 * @returns An Effect that succeeds with a boolean indicating if the message is valid
 */
export function verifyMessage(params: VerifyMessageParams): Effect.Effect<boolean, VerifyMessageError, never> {
	return Effect.try({
		try: () => Ox.Siwe.verifyMessage(params),
		catch: (cause) => new VerifyMessageError(cause),
	})
}

/**
 * Error class for parseMessage function
 */
export class ParseMessageError extends Error {
	override name = 'ParseMessageError'
	_tag = 'ParseMessageError'
	constructor(cause: unknown) {
		super('Failed to parse SIWE message with ox', {
			cause,
		})
	}
}

/**
 * Parses a SIWE message
 * @param message The message string to parse
 * @returns An Effect that succeeds with a parsed SIWE message
 */
export function parseMessage(message: string): Effect.Effect<Message, ParseMessageError, never> {
	return Effect.try({
		try: () => Ox.Siwe.parseMessage(message),
		catch: (cause) => new ParseMessageError(cause),
	})
}
