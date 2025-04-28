import { Context, Effect, Layer } from 'effect'
import * as Address from 'ox/core/Address'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Address
 */
export type AddressEffect = Address.Address

/**
 * Ox Address effect service interface
 */
export interface AddressEffectService {
	/**
	 * Asserts if the given value is an Address in an Effect
	 */
	assertEffect(value: unknown): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Checks if the given value is a valid checksummed address in an Effect
	 */
	checksumEffect(address: Address.Address): Effect.Effect<Address.Address, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts from Bytes to Address in an Effect
	 */
	fromBytesEffect(bytes: Bytes.Bytes): Effect.Effect<Address.Address, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts from Hex to Address in an Effect
	 */
	fromHexEffect(hex: Hex.Hex): Effect.Effect<Address.Address, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts from PrivateKey to Address in an Effect
	 */
	fromPrivateKeyEffect(privateKey: Hex.Hex): Effect.Effect<Address.Address, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts from String to Address in an Effect
	 */
	fromStringEffect(value: string): Effect.Effect<Address.Address, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats the address in an Effect
	 */
	formatEffect(
		address: Address.Address,
		options?: Address.format.Options,
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Checks if the provided address is a valid contract address in an Effect
	 */
	isAddressEffect(value: unknown): Effect.Effect<boolean, never, never>

	/**
	 * Checks if two addresses are equal in an Effect
	 */
	isEqualEffect(
		a: Address.Address,
		b: Address.Address,
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts an Address to Bytes in an Effect
	 */
	toBytesEffect(address: Address.Address): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts an Address to Hex in an Effect
	 */
	toHexEffect(address: Address.Address): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validates an Address in an Effect
	 */
	validateEffect(value: unknown): Effect.Effect<boolean, never, never>
}

/**
 * Tag for AddressEffectService dependency injection
 */
export const AddressEffectTag = Context.Tag<AddressEffectService>('@tevm/ox/AddressEffect')

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
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Live implementation of AddressEffectService
 */
export const AddressEffectLive: AddressEffectService = {
	assertEffect: (value) =>
		catchOxErrors(
			Effect.try(() => {
				Address.assert(value)
			}),
		),

	checksumEffect: (address) => catchOxErrors(Effect.try(() => Address.checksum(address))),

	fromBytesEffect: (bytes) => catchOxErrors(Effect.try(() => Address.fromBytes(bytes))),

	fromHexEffect: (hex) => catchOxErrors(Effect.try(() => Address.fromHex(hex))),

	fromPrivateKeyEffect: (privateKey) => catchOxErrors(Effect.try(() => Address.fromPrivateKey(privateKey))),

	fromStringEffect: (value) => catchOxErrors(Effect.try(() => Address.fromString(value))),

	formatEffect: (address, options) => catchOxErrors(Effect.try(() => Address.format(address, options))),

	isAddressEffect: (value) => Effect.succeed(Address.isAddress(value)),

	isEqualEffect: (a, b) => catchOxErrors(Effect.try(() => Address.isEqual(a, b))),

	toBytesEffect: (address) => catchOxErrors(Effect.try(() => Address.toBytes(address))),

	toHexEffect: (address) => catchOxErrors(Effect.try(() => Address.toHex(address))),

	validateEffect: (value) => Effect.succeed(Address.validate(value)),
}

/**
 * Layer that provides the AddressEffectService implementation
 */
export const AddressEffectLayer = Layer.succeed(AddressEffectTag, AddressEffectLive)
