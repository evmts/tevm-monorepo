import { describe, it, expect } from 'vitest'
import { keccak256 } from './keccak256.js'
import { hexToBytes } from './hexToBytes.js'
import { bytesToHex } from './bytesToHex.js'

describe('keccak256', () => {
  it('should correctly hash an empty string', async () => {
    const result = await keccak256('0x')
    expect(result).toBe('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')
  })

  it('should correctly hash "hello world"', async () => {
    // "hello world" in hex
    const result = await keccak256('0x68656c6c6f20776f726c64')
    expect(result).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')
  })

  it('should correctly hash bytes', async () => {
    const bytes = new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]) // "hello world"
    const result = await keccak256(bytes)
    expect(result).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')
  })

  it('should handle strings without 0x prefix', async () => {
    const result = await keccak256('68656c6c6f20776f726c64')
    expect(result).toBe('0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad')
  })
})

describe('hexToBytes', () => {
  it('should convert hex string to bytes', async () => {
    const result = await hexToBytes('0x68656c6c6f')
    expect(Array.from(result)).toEqual([104, 101, 108, 108, 111]) // "hello"
  })

  it('should handle strings without 0x prefix', async () => {
    const result = await hexToBytes('68656c6c6f')
    expect(Array.from(result)).toEqual([104, 101, 108, 108, 111]) // "hello"
  })

  it('should handle empty strings', async () => {
    const result = await hexToBytes('0x')
    expect(Array.from(result)).toEqual([])
  })
})

describe('bytesToHex', () => {
  it('should convert bytes to hex string', async () => {
    const result = await bytesToHex(new Uint8Array([104, 101, 108, 108, 111])) // "hello"
    expect(result).toBe('0x68656c6c6f')
  })

  it('should handle empty arrays', async () => {
    const result = await bytesToHex(new Uint8Array([]))
    expect(result).toBe('0x')
  })
})