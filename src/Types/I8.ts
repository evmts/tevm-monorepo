import { Int, intSchema, intFromBytes, intFromHex, intFromString } from './common.js'
import { Hex, Bytes } from 'ox'

export const I8 = intSchema(8)
export type I8 = Int<8>
export const I8FromBytes = intFromBytes(8)
export const I8FromHex = intFromHex(8)
export const I8FromString = intFromString(8)

/**
 * Converts an I8 value to its hex string representation
 * @param value - The I8 value to convert
 * @returns The hex string representation
 */
export const I8ToHex = (value: I8): string => Hex.fromNumber(value)

/**
 * Converts an I8 value to its bytes representation
 * @param value - The I8 value to convert
 * @returns The bytes representation
 */
export const I8ToBytes = (value: I8): Uint8Array => Bytes.fromNumber(value)