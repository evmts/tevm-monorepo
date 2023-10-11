/**
 * @module @evmts/schemas/ethereum/SAddress/isAddress.js
 * @category Ethereum
 * @description Checks if a string is a valid Ethereum address.
 */

/**
 * Regex for Ethereum addresses.
 */
const addressRegex = /^0x[a-fA-F0-9]{40}$/

/**
 * Checks if a string is a valid Ethereum address.
 * @param {string} address - The address to check.
 * @returns {boolean} - True if the address is valid.
 * {@link https://docs.soliditylang.org/en/latest/types.html#address Solidity docs}
 * @example
 * ```ts
 * isAddress('0x1234'); // false
 * isAddress('0x1234567890123456789012345678901234567890'); // true
 * ```
 */
export const isAddress = (address) => addressRegex.test(address)
