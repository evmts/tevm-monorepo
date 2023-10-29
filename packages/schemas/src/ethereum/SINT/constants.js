/**
 * @module @evmts/schemas/ethereum/SINT/constants.js
 * @description Constants for SINT
 * @author William Cory <willcory10@gmail.com>
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
