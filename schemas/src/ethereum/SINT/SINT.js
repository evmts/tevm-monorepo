/**
 * @module @evmts/schemas/ethereum/SINT/SINT.js
 * @description Types and validators for Solidity INT
 * @author William Cory <willcory10@gmail.com>
 */

import {
	INT8_MAX,
	INT8_MIN,
	INT16_MAX,
	INT16_MIN,
	INT32_MAX,
	INT32_MIN,
	INT64_MAX,
	INT64_MIN,
	INT128_MAX,
	INT128_MIN,
	INT256_MAX,
	INT256_MIN,
} from './constants.js'
import {
	bigintFromSelf,
	greaterThanOrEqualToBigint,
	lessThanOrEqualToBigint,
} from '@effect/schema/Schema'

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
