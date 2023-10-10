/**
 * @module UINT and INT Schema
 * Types and validators for Solidity integers
 */

import {
	bigintFromSelf,
	lessThanOrEqualToBigint,
	nonNegativeBigint,
	parseEither,
} from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { Effect } from 'effect'
import { mapError, runSync } from 'effect/Effect'
import { isRight } from 'effect/Either'

/**
 * Type representing a valid UINT8.
 * A valid UINT8 is a `bigint` >= 0 and < 2^8.
 * @typedef {bigint} UINT8
 * @example
 * ```typescript
 * import { UINT8 } from '@evmts/schemas';
 * const uint8 = BigInt(127) as UINT8;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
/**
 * Type representing a valid UINT16.
 * A valid UINT16 is a `bigint` >= 0 and < 2^16.
 * @typedef {bigint} UINT16
 * @example
 * ```typescript
 * import { UINT16 } from '@evmts/schemas';
 * const uint16 = BigInt(32767) as UINT16;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
/**
 * Type representing a valid UINT32.
 * A valid UINT32 is a `bigint` >= 0 and < 2^32.
 * @typedef {bigint} UINT32
 * @example
 * ```typescript
 * import { UINT32 } from '@evmts/schemas';
 * const uint32 = BigInt(2147483647) as UINT32;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
/**
 * Type representing a valid UINT64.
 * A valid UINT64 is a `bigint` >= 0 and < 2^64.
 * @typedef {bigint} UINT64
 * @example
 * ```typescript
 * import { UINT64 } from '@evmts/schemas';
 * const uint64 = BigInt(9223372036854775807) as UINT64;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
/**
 * Type representing a valid UINT128.
 * A valid UINT128 is a `bigint` >= 0 and < 2^128.
 * @typedef {bigint} UINT128
 * @example
 * ```typescript
 * import { UINT128 } from '@evmts/schemas';
 * const uint128 = BigInt("170141183460469231731687303715884105727") as UINT128;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
/**
 * Type representing a valid UINT256.
 * A valid UINT256 is a `bigint` >= 0 and < 2^256.
 * @typedef {bigint} UINT256
 * @example
 * ```typescript
 * import { UINT256 } from '@evmts/schemas';
 * const uint256 = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935") as UINT256;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */

/**
 * The maximum value a {@link UINT8} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const UINT8_MAX = BigInt('0xFF')
/**
 * The maximum value a {@link UINT16} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const UINT16_MAX = BigInt('0xFFFF')
/**
 * The maximum value a {@link UINT32} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const UINT32_MAX = BigInt('0xFFFFFFFF')
/**
 * The maximum value a {@link UINT64} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const UINT64_MAX = BigInt('0xFFFFFFFFFFFFFFFF')
/**
 * The maximum value a {@link UINT128} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const UINT128_MAX = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
/**
 * The maximum value a {@link UINT256} can be.
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const UINT256_MAX = BigInt(
	'0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
)

/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the UINT8 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, UINT8>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUINT8: Schema<bigint, UINT8>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SUINT8 = bigintFromSelf.pipe(
	nonNegativeBigint(),
	lessThanOrEqualToBigint(UINT8_MAX),
)
/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the UINT16 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, UINT16>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUINT16: Schema<bigint, UINT16>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SUINT16 = bigintFromSelf.pipe(
	nonNegativeBigint(),
	lessThanOrEqualToBigint(UINT16_MAX),
)
/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the UINT16 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, UINT32>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUINT32: Schema<bigint, UINT32>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SUINT32 = bigintFromSelf.pipe(
	nonNegativeBigint(),
	lessThanOrEqualToBigint(UINT32_MAX),
)
/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the UINT64 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, UINT64>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUINT64: Schema<bigint, UINT64>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SUINT64 = bigintFromSelf.pipe(
	nonNegativeBigint(),
	lessThanOrEqualToBigint(UINT64_MAX),
)
/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the UINT128 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, UINT128>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUINT128: Schema<bigint, UINT128>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SUINT128 = bigintFromSelf.pipe(
	nonNegativeBigint(),
	lessThanOrEqualToBigint(UINT128_MAX),
)
/**
 * [Effect schema](https://github.com/Effect-TS/schema) for the UINT256 type.
 * @type {import('@effect/schema/Schema').Schema<bigint, UINT256>}
 * @example
 * ```typescript
 * import { Schema } from '@effect/schema/Schema';
 * export const SUINT256: Schema<bigint, UINT256>;
 * ```
 * {@link https://docs.soliditylang.org/en/latest/types.html#integers Solidity docs}
 */
export const SUINT256 = bigintFromSelf.pipe(
	nonNegativeBigint(),
	lessThanOrEqualToBigint(UINT256_MAX),
)

/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT8.
 * @param {unknown} uint8
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT8 } from '@evmts/schemas';
 * isUINT8(BigInt(127));  // true
 * isUINT8(BigInt(256));  // false
 * ````
 */
export const isUINT8 = (uint8) => {
	return isRight(parseEither(SUINT8)(uint8))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT16.
 * @param {unknown} uint16
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT16 } from '@evmts/schemas';
 * isUINT16(BigInt(32767));  // true
 * isUINT16(BigInt(65536));  // false
 * ````
 */
export const isUINT16 = (uint16) => {
	return isRight(parseEither(SUINT16)(uint16))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT32.
 * @param {unknown} uint32
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT32 } from '@evmts/schemas';
 * isUINT32(BigInt(2147483647));  // true
 * isUINT32(BigInt(4294967296));  // false
 * ````
 */
export const isUINT32 = (uint32) => {
	return isRight(parseEither(SUINT32)(uint32))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT64.
 * @param {unknown} uint64
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT64 } from '@evmts/schemas';
 * isUINT64(BigInt("9223372036854775807"));  // true
 * isUINT64(BigInt("18446744073709551616"));  // false
 * ````
 */
export const isUINT64 = (uint64) => {
	return isRight(parseEither(SUINT64)(uint64))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT128.
 * @param {unknown} uint128
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT128 } from '@evmts/schemas';
 * isUINT128(BigInt("170141183460469231731687303715884105727"));  // true
 * isUINT128(BigInt("340282366920938463463374607431768211456"));  // false
 * ````
 */
export const isUINT128 = (uint128) => {
	return isRight(parseEither(SUINT128)(uint128))
}
/**
 * Type guard that returns true if the provided bigint is a valid Ethereum UINT256.
 * @param {unknown} uint256
 * @returns {boolean}
 * @example
 * ```ts
 * import { isUINT256 } from '@evmts/schemas';
 * isUINT256(BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935"));  // true
 * isUINT256(BigInt("231584178474632390847141970017375815706539969331281128078915168015826259279872"));  // false
 * ````
 */
export const isUINT256 = (uint256) => {
	return isRight(parseEither(SUINT256)(uint256))
}

/**
 * @typedef {'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256'} UINTName
 * @typedef {8 | 16 | 32 | 64 | 128 | 256} UINTSize
 */

// TODO more granular errors
/**
 * Error thrown when a UINT256 is invalid.
 * A uintbigint is invalid if it is not a non-negative integer or overflows
 */
export class InvalidUINTError extends TypeError {
	/**
	 * @param {Object} options - The options for the error.
	 * @param {bigint} options.uint - The invalid uint256 bigint.
	 * @param {UINTSize} options.size - The size of the uint.
	 * @param {string} [options.message] - The error message.
	 * @param {string} [options.docs] - The documentation URL.
	 * @param {import('effect/ReadonlyArray').NonEmptyReadonlyArray<import('@effect/schema/ParseResult').ParseErrors>} [options.cause] - The cause of the error.
	 */
	constructor({
		uint,
		size,
		message = uint < BigInt(0)
			? `Recieved ${uint} is too small to be a ${size}. Must be >= 0.`
			: `Value uint${size} is too big to be a UINT${size}`,
		cause,
		docs = 'https://evmts.dev/reference/errors',
	}) {
		super(`${InvalidUINTError.name}: ${message}\n${docs}`)
		this.cause = cause && formatErrors(cause)
	}
}

/**
 * Safely parses a UINT8 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TUINT8 extends bigint
 * @param {TUINT8} uint8
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT8>}
 */
export const parseUINT8Safe = (uint8) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT8>} */
		(
			parseEither(SUINT8)(uint8).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint8),
							size: 8,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT16 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TUINT16 extends bigint
 * @param {TUINT16} uint16
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT16>}
 */
export const parseUINT16Safe = (uint16) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT16>} */
		(
			parseEither(SUINT16)(uint16).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint16),
							size: 16,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT32 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TUINT32 extends bigint
 * @param {TUINT32} uint32
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT32>}
 */
export const parseUINT32Safe = (uint32) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT32>} */
		(
			parseEither(SUINT32)(uint32).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint32),
							size: 32,
							cause,
						}),
				),
			)
		)
	return out
}

// For UINT64
/**
 * Safely parses a UINT64 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TUINT64 extends bigint
 * @param {TUINT64} uint64
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT64>}
 */
export const parseUINT64Safe = (uint64) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT64>} */
		(
			parseEither(SUINT64)(uint64).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint64),
							size: 64,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT128 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TUINT128 extends bigint
 * @param {TUINT128} uint128
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT128>}
 */
export const parseUINT128Safe = (uint128) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT128>} */
		(
			parseEither(SUINT128)(uint128).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint128),
							size: 128,
							cause,
						}),
				),
			)
		)
	return out
}
/**
 * Safely parses a UINT256 into an [Effect](https://www.effect.website/docs/essentials/effect-type).
 * @template TUINT256 extends bigint
 * @param {TUINT256} uint256
 * @returns {Effect.Effect<never, InvalidUINTError, TUINT256>}
 * @example
 * ```ts
 * import { parseUINT256Safe } from '@evmts/schemas';
 * const parsedUINT256Effect = parseUINT256Safe('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseUINT256Safe = (uint256) => {
	const out =
		/** @type {Effect.Effect<never, InvalidUINTError, TUINT256>} */
		(
			parseEither(SUINT256)(uint256).pipe(
				mapError(
					({ errors: cause }) =>
						new InvalidUINTError({
							uint: /** @type bigint */ (uint256),
							size: 256,
							cause,
						}),
				),
			)
		)
	return out
}

/**
 * Parses a UINT8 and returns the value if no errors.
 * @template TUINT8 extends UINT8
 * @param {TUINT8} uint8
 * @returns {TUINT8}
 * @example
 * ```ts
 * import { parseUINT8 } from '@evmts/schemas';
 * const parsedUINT8 = parseUINT8(BigInt(127));
 * ```
 */
export const parseUINT8 = (uint8) => {
	return runSync(parseUINT8Safe(uint8))
}
/**
 * Parses a UINT16 and returns the value if no errors.
 * @template TUINT16 extends UINT16
 * @param {TUINT16} uint16
 * @returns {TUINT16}
 * @example
 * ```ts
 * import { parseUINT16 } from '@evmts/schemas';
 * const parsedUINT16 = parseUINT16(BigInt(32767));
 * ```
 */
export const parseUINT16 = (uint16) => {
	return runSync(parseUINT16Safe(uint16))
}
/**
 * Parses a UINT32 and returns the value if no errors.
 * @template TUINT32 extends UINT32
 * @param {TUINT32} uint32
 * @returns {TUINT32}
 * @example
 * ```ts
 * import { parseUINT32 } from '@evmts/schemas';
 * const parsedUINT32 = parseUINT32(BigInt(2147483647));
 * ```
 */
export const parseUINT32 = (uint32) => {
	return runSync(parseUINT32Safe(uint32))
}
/**
 * Parses a UINT64 and returns the value if no errors.
 * @template TUINT64 extends UINT64
 * @param {TUINT64} uint64
 * @returns {TUINT64}
 * @example
 * ```ts
 * import { parseUINT64 } from '@evmts/schemas';
 * const parsedUINT64 = parseUINT64(BigInt("9223372036854775807"));
 * ```
 */
export const parseUINT64 = (uint64) => {
	return runSync(parseUINT64Safe(uint64))
}
/**
 * Parses a UINT128 and returns the value if no errors.
 * @template TUINT128 extends UINT128
 * @param {TUINT128} uint128
 * @returns {TUINT128}
 * @example
 * ```ts
 * import { parseUINT128 } from '@evmts/schemas';
 * const parsedUINT128 = parseUINT128(BigInt("170141183460469231731687303715884105727"));
 * ```
 */
export const parseUINT128 = (uint128) => {
	return runSync(parseUINT128Safe(uint128))
}
/**
 * Parses a UINT256 and returns the value if no errors.
 * @template TUINT256 extends UINT256
 * @param {TUINT256} uint256
 * @returns {TUINT256}
 * @example
 * ```ts
 * import { parseUINT256 } from '@evmts/schemas';
 * const parsedUINT256 = parseUINT256('0x1234567890abcdef1234567890abcdef12345678');
 * ```
 */
export const parseUINT256 = (uint256) => {
	return runSync(parseUINT256Safe(uint256))
}
