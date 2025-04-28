import type { Address } from '@tevm/utils'
import { bytesToHex, getAddress, hexToBytes, isAddress } from '@tevm/utils'
import { Effect } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Address
 */
export type AddressEffect = Address

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(
			new BaseErrorEffect('Unknown error', {
				cause: error instanceof Error ? error : undefined,
			}),
		)
	})
}

/**
 * Asserts if the given value is an Address in an Effect
 */
export function assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(
		Effect.try(() => {
			if (typeof value !== 'string' || !isAddress(value)) {
				throw new Error('Invalid address')
			}
		}),
	)
}

/**
 * Checks if the given value is a valid checksummed address in an Effect
 */
export function checksumEffect(address: Address): Effect.Effect<Address, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => getAddress(address)))
}

/**
 * Converts from Bytes to Address in an Effect
 */
export function fromBytesEffect(bytes: Uint8Array): Effect.Effect<Address, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => getAddress(bytesToHex(bytes))))
}

/**
 * Converts from Hex to Address in an Effect
 */
export function fromHexEffect(hex: string): Effect.Effect<Address, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => getAddress(hex)))
}

/**
 * Converts from PrivateKey to Address in an Effect
 */
export function fromPrivateKeyEffect(): Effect.Effect<
	// privateKey: string,
	Address,
	BaseErrorEffect<Error | undefined>,
	never
> {
	return catchOxErrors(
		Effect.try(() => {
			// TODO: Implement private key to address conversion
			throw new Error('Not implemented')
		}),
	)
}

/**
 * Converts from String to Address in an Effect
 */
export function fromStringEffect(value: string): Effect.Effect<Address, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => getAddress(value)))
}

/**
 * Formats the address in an Effect
 */
export function formatEffect(
	address: Address,
	options?: { case?: 'lowercase' | 'uppercase' },
): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(
		Effect.try(() => {
			const checksummed = getAddress(address)
			if (options?.case === 'lowercase') {
				return checksummed.toLowerCase()
			}
			if (options?.case === 'uppercase') {
				return checksummed.toUpperCase()
			}
			return checksummed
		}),
	)
}

/**
 * Checks if the provided address is a valid contract address in an Effect
 */
export function isAddressEffect(value: string): Effect.Effect<boolean, never, never> {
	return Effect.succeed(isAddress(value))
}

/**
 * Checks if two addresses are equal in an Effect
 */
export function isEqualEffect(
	a: Address,
	b: Address,
): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => getAddress(a) === getAddress(b)))
}

/**
 * Converts an Address to Bytes in an Effect
 */
export function toBytesEffect(address: Address): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => hexToBytes(address)))
}

/**
 * Converts an Address to Hex in an Effect
 */
export function toHexEffect(address: Address): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never> {
	return catchOxErrors(Effect.try(() => getAddress(address)))
}

/**
 * Validates an Address in an Effect
 */
export function validateEffect(value: string): Effect.Effect<boolean, never, never> {
	return Effect.succeed(isAddress(value))
}
