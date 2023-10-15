import {
  SizeExceedsPaddingSizeError,
  type SizeExceedsPaddingSizeErrorType,
} from '../../errors/data.js'
import type { ErrorType } from '../../errors/utils.js'
import type { ByteArray, Hex } from '../../types/misc.js'

type PadOptions = {
  dir?: 'left' | 'right'
  size?: number | null
}
export type PadReturnType<TValue extends ByteArray | Hex> = TValue extends Hex
  ? Hex
  : ByteArray

export type PadErrorType = PadHexErrorType | PadBytesErrorType | ErrorType

export function pad<TValue extends ByteArray | Hex>(
  hexOrBytes: TValue,
  { dir, size = 32 }: PadOptions = {},
): PadReturnType<TValue> {
  if (typeof hexOrBytes === 'string')
    return padHex(hexOrBytes, { dir, size }) as PadReturnType<TValue>
  return padBytes(hexOrBytes, { dir, size }) as PadReturnType<TValue>
}

export type PadHexErrorType = SizeExceedsPaddingSizeErrorType | ErrorType

export function padHex(hex_: Hex, { dir, size = 32 }: PadOptions = {}) {
  if (size === null) return hex_
  const hex = hex_.replace('0x', '')
  if (hex.length > size * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size,
      type: 'hex',
    })

  return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](
    size * 2,
    '0',
  )}` as Hex
}

export type PadBytesErrorType = SizeExceedsPaddingSizeErrorType | ErrorType

export function padBytes(
  bytes: ByteArray,
  { dir, size = 32 }: PadOptions = {},
) {
  if (size === null) return bytes
  if (bytes.length > size)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size,
      type: 'bytes',
    })
  const paddedBytes = new Uint8Array(size)
  for (let i = 0; i < size; i++) {
    const padEnd = dir === 'right'
    paddedBytes[padEnd ? i : size - i - 1] =
      bytes[padEnd ? i : bytes.length - i - 1]
  }
  return paddedBytes
}
