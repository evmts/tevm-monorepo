/**
 * @module UINT and INT Schema
 * Types and validators for Solidity integers
 * Represents the sequential order of a uint256 in the Ethereum blockchain.
 */

import {
	bigintFromSelf,
	greaterThanOrEqualToBigint,
	lessThanOrEqualToBigint,
	parseEither,
} from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import { isRight } from 'effect/Either'

/**
 * Type representing a valid INT8.
 * A valid INT8 is a `bigint` >= -2^7 and < 2^7.
 * @typedef {bigint} INT8
 */
/**
 * Type representing a valid INT16.
 * A valid INT16 is a `bigint` >= -2^15 and < 2^15.
 * @typedef {bigint} INT16
 */
/**
 * Type representing a valid INT32.
 * A valid INT32 is a `bigint` >= -2^31 and < 2^31.
 * @typedef {bigint} INT32
 */
/**
 * Type representing a valid INT64.
 * A valid INT64 is a `bigint` >= -2^63 and < 2^63.
 * @typedef {bigint} INT64
 */
/**
 * Type representing a valid INT128.
 * A valid INT128 is a `bigint` >= -2^127 and < 2^127.
 * @typedef {bigint} INT128
 */
/**
 * Type representing a valid INT256.
 * A valid INT256 is a `bigint` >= -2^255 and < 2^255.
 * @typedef {bigint} INT256
 */

/**
 * The maximum value a {@link INT8} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT8_MAX = BigInt('0x7F')
/**
 * The minimum value a {@link INT8} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT8_MIN = -BigInt('0x80')
/**
 * The maximum value a {@link INT16} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT16_MAX = BigInt('0x7FFF')
/**
 * The minimum value a {@link INT16} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT16_MIN = -BigInt('0x8000')
/**
 * The maximum value a {@link INT32} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT32_MAX = BigInt('0x7FFFFFFF')
/**
 * The minimum value a {@link INT32} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT32_MIN = -BigInt('0x80000000')
/**
 * The maximum value a {@link INT64} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT64_MAX = BigInt('0x7FFFFFFFFFFFFFFF')
/**
 * The minimum value a {@link INT64} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT64_MIN = -BigInt('0x8000000000000000')
/**
 * The maximum value a {@link INT128} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT128_MAX = BigInt('0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
/**
 * The minimum value a {@link INT128} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT128_MIN = -BigInt('0x80000000000000000000000000000000')
/**
 * The maximum value a {@link INT256} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT256_MAX = BigInt(
	'0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
)
/**
 * The minimum value a {@link INT256} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const INT256_MIN = -BigInt(
	'0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the INT8 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, INT8>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SINT8: Schema<bigint, INT8>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SINT8 = bigintFromSelf.pipe(
	greaterThanOrEqualToBigint(INT8_MIN),
	lessThanOrEqualToBigint(INT8_MAX),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the INT16 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, INT16>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SINT16: Schema<bigint, INT16>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SINT16 = bigintFromSelf.pipe(
	greaterThanOrEqualToBigint(INT16_MIN),
	lessThanOrEqualToBigint(INT16_MAX),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the INT32 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, INT32>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SINT32: Schema<bigint, INT32>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SINT32 = bigintFromSelf.pipe(
	greaterThanOrEqualToBigint(INT32_MIN),
	lessThanOrEqualToBigint(INT32_MAX),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the INT64 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, INT64>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SINT64: Schema<bigint, INT64>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SINT64 = bigintFromSelf.pipe(
	greaterThanOrEqualToBigint(INT64_MIN),
	lessThanOrEqualToBigint(INT64_MAX),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the INT128 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, INT128>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SINT128: Schema<bigint, INT128>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SINT128 = bigintFromSelf.pipe(
	greaterThanOrEqualToBigint(INT128_MIN),
	lessThanOrEqualToBigint(INT128_MAX),
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the INT256 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, INT256>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SINT256: Schema<bigint, INT256>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SINT256 = bigintFromSelf.pipe(
	greaterThanOrEqualToBigint(INT256_MIN),
	lessThanOrEqualToBigint(INT256_MAX),
)

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT8.
 * @param {unknown} int8
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT8 } from '@evmts/schemas';
 * isINT8(BigInt(-128));  // true
 * isINT8(BigInt(127));   // true
 * isINT8(BigInt(128));   // false
 * isINT8(BigInt(-129));  // false
 * ````
 */
export const isINT8 = (int8) => {
	return isRight(parseEither(SINT8)(int8))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT16.
 * @param {unknown} int16
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT16 } from '@evmts/schemas';
 * isINT16(BigInt(-32768));  // true
 * isINT16(BigInt(32767));   // true
 * isINT16(BigInt(32768));   // false
 * isINT16(BigInt(-32769));  // false
 * ````
 */
export const isINT16 = (int16) => {
	return isRight(parseEither(SINT16)(int16))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT32.
 * @param {unknown} int32
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT32 } from '@evmts/schemas';
 * isINT32(BigInt(-2147483648));  // true
 * isINT32(BigInt(2147483647));   // true
 * isINT32(BigInt(2147483648));   // false
 * isINT32(BigInt(-2147483649));  // false
 * ````
 */
export const isINT32 = (int32) => {
	return isRight(parseEither(SINT32)(int32))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT64.
 * @param {unknown} int64
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT64 } from '@evmts/schemas';
 * isINT64(BigInt("-9223372036854775808"));  // true
 * isINT64(BigInt("9223372036854775807"));   // true
 * isINT64(BigInt("9223372036854775808"));   // false
 * isINT64(BigInt("-9223372036854775809"));  // false
 * ````
 */
export const isINT64 = (int64) => {
	return isRight(parseEither(SINT64)(int64))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT128.
 * @param {unknown} int128
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT128 } from '@evmts/schemas';
 * isINT128(BigInt("-170141183460469231731687303715884105728"));  // true
 * isINT128(BigInt("170141183460469231731687303715884105727"));   // true
 * isINT128(BigInt("170141183460469231731687303715884105728"));   // false
 * isINT128(BigInt("-170141183460469231731687303715884105729"));  // false
 * ````
 */
export const isINT128 = (int128) => {
	return isRight(parseEither(SINT128)(int128))
}

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum INT256.
 * @param {unknown} int256
 * @returns {boolean}
 * @example
 * ```ts
 * import { isINT256 } from '@evmts/schemas';
 * isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639936"));  // true
 * isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));   // true
 * isINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639936"));   // false
 * isINT256(BigInt("-115792089237316195423570985008687907853269984665640564039457584007913129639937"));  // false
 * ````
 */
export const isINT256 = (int256) => {
	return isRight(parseEither(SINT256)(int256))
}

/**
 * @typedef {'int8' | 'int16' | 'int32' | 'int64' | 'int128' | 'int256'} INTName
 * @typedef {8 | 16 | 32 | 64 | 128 | 256} INTSize
 */

// TODO more granular errors
/**
 * Error thrown when an INT is invalid.
 * An int bigint is invalid if it's not within the bounds of its size.
 */
export class InvalidINTError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {bigint} options.int - The invalid int bigint.
	 * @param {INTSize} options.size - The size of the int.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		int,
		size,
		message,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		if (!message) {
			const min = BigInt(1) << BigInt(size - 1)
			if (int < -min) {
				message = `Received ${int} is too small to be an INT${size}. Must be >= -2^${
					size - 1
				}.`
			} else {
				message = `Received ${int} is too large to be an INT${size}. Must be < 2^${
					size - 1
				}.`
			}
		}
		super(`${InvalidINTError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}

/**
 * Safely parses an INT8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT8 extends bigint
 * @param {TINT8} int8
 * @returns {Effect.Effect<never, InvalidINTError, TINT8>}
 */
export const parseINT8Safe = (int8) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT8>} */
		(
			parseEither(SINT8)(int8).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int8),
							size: 8,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT16 extends bigint
 * @param {TINT16} int16
 * @returns {Effect.Effect<never, InvalidINTError, TINT16>}
 */
export const parseINT16Safe = (int16) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT16>} */
		(
			parseEither(SINT16)(int16).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int16),
							size: 16,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT32 extends bigint
 * @param {TINT32} int32
 * @returns {Effect.Effect<never, InvalidINTError, TINT32>}
 */
export const parseINT32Safe = (int32) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT32>} */
		(
			parseEither(SINT32)(int32).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int32),
							size: 32,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT64 extends bigint
 * @param {TINT64} int64
 * @returns {Effect.Effect<never, InvalidINTError, TINT64>}
 */
export const parseINT64Safe = (int64) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT64>} */
		(
			parseEither(SINT64)(int64).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int64),
							size: 64,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT128 extends bigint
 * @param {TINT128} int128
 * @returns {Effect.Effect<never, InvalidINTError, TINT128>}
 */
export const parseINT128Safe = (int128) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT128>} */
		(
			parseEither(SINT128)(int128).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int128),
							size: 128,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Safely parses an INT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TINT256 extends bigint
 * @param {TINT256} int256
 * @returns {Effect.Effect<never, InvalidINTError, TINT256>}
 */
export const parseINT256Safe = (int256) => {
	const out =
		/** @type {Effect.Effect<never, InvalidINTError, TINT256>} */
		(
			parseEither(SINT256)(int256).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidINTError({
							int: /** @type bigint */ (int256),
							size: 256,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Parses an INT8 and returns the value if no errors.
 * @template TINT8 extends INT8
 * @param {TINT8} int8
 * @returns {TINT8}
 * @example
 * ```ts
 * import { parseInt8 } from '@evmts/schemas';
 * const parsedINT8 = parseInt8(BigInt(-128));
 * ```
 */
export const parseInt8 = (int8) => {
	return runSync(parseINT8Safe(int8))
}

/**
 * Parses an INT16 and returns the value if no errors.
 * @template TINT16 extends INT16
 * @param {TINT16} int16
 * @returns {TINT16}
 * @example
 * ```ts
 * import { parseInt16 } from '@evmts/schemas';
 * const parsedINT16 = parseInt16(BigInt(-32768));
 * ```
 */
export const parseInt16 = (int16) => {
	return runSync(parseINT16Safe(int16))
}

/**
 * Parses an INT32 and returns the value if no errors.
 * @template TINT32 extends INT32
 * @param {TINT32} int32
 * @returns {TINT32}
 * @example
 * ```ts
 * import { parseInt32 } from '@evmts/schemas';
 * const parsedINT32 = parseInt32(BigInt(-2147483648));
 * ```
 */
export const parseInt32 = (int32) => {
	return runSync(parseINT32Safe(int32))
}

/**
 * Parses an INT64 and returns the value if no errors.
 * @template TINT64 extends INT64
 * @param {TINT64} int64
 * @returns {TINT64}
 * @example
 * ```ts
 * import { parseInt64 } from '@evmts/schemas';
 * const parsedINT64 = parseInt64(BigInt("-9223372036854775808"));
 * ```
 */
export const parseInt64 = (int64) => {
	return runSync(parseINT64Safe(int64))
}

/**
 * Parses an INT128 and returns the value if no errors.
 * @template TINT128 extends INT128
 * @param {TINT128} int128
 * @returns {TINT128}
 * @example
 * ```ts
 * import { parseInt128 } from '@evmts/schemas';
 * const parsedINT128 = parseInt128(BigInt("-170141183460469231731687303715884105728"));
 * ```
 */
export const parseInt128 = (int128) => {
	return runSync(parseINT128Safe(int128))
}

/**
 * Parses an INT256 and returns the value if no errors.
 * @template TINT256 extends INT256
 * @param {TINT256} int256
 * @returns {TINT256}
 * @example
 * ```ts
 * import { parseInt256 } from '@evmts/schemas';
 * const parsedINT256 = parseInt256('-0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseInt256 = (int256) => {
	return runSync(parseINT256Safe(int256))
}
