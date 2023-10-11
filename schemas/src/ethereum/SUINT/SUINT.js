/**
 * @module @evmts/schemas/ethereum/SUINT/SUINT.js
 * @description Types and validators for Solidity UINT
 * @author William Cory <willcory10@gmail.com>
 */

import {
	UINT8_MAX,
	UINT16_MAX,
	UINT32_MAX,
	UINT64_MAX,
	UINT128_MAX,
	UINT256_MAX,
} from './constants.js'
import {
	bigintFromSelf,
	lessThanOrEqualToBigint,
	nonNegativeBigint,
} from '@effect/schema/Schema'

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
