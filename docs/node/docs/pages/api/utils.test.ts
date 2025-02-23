import { describe, it, expect } from 'vitest'
import { createAddress } from 'tevm/address'
import { Address } from 'tevm/address'
import { createContractAddress } from 'tevm/address'
import {
  bytesToHex,
  hexToBytes,
  bytesToBigInt,
  bytesToNumber,
  hexToBigInt,
  hexToNumber,
  numberToHex,
  stringToHex,
  hexToString,
  isHex,
  isBytes,
  isAddress,
  formatEther,
  parseEther,
  formatGwei,
  parseGwei,
  keccak256,
  ecrecover,
  ecsign,
  randomBytes,
  encodeAbiParameters,
  decodeAbiParameters,
  encodeFunctionData,
  decodeFunctionData,
  encodeEventTopics,
  decodeEventLog,
  toRlp,
  fromRlp,
  createMemoryDb
} from '@tevm/utils'

describe('@tevm/utils', () => {
  describe('Address Creation and Handling', () => {
    it('should create addresses from various formats', () => {
      // From hex string
      let addr = createAddress(`0x${"00".repeat(20)}`)
      expect(addr).toBeDefined()

      // From bigint
      addr = createAddress(420n)
      expect(addr).toBeDefined()

      // From Uint8Array
      addr = createAddress(new Uint8Array(20))
      expect(addr).toBeDefined()
    })

    it('should work with Address class', () => {
      const a = new Address(new Uint8Array(20))
      expect(a.bytes).toBeDefined()
      expect(a.toString()).toMatch(/^0x[a-f0-9]{40}$/)
    })

    it('should create contract addresses', () => {
      const from = createAddress("0x1111111111111111111111111111111111111111")
      const nonce = 1n
      const contractAddr = createContractAddress(from, nonce)
      expect(contractAddr).toBeDefined()
    })
  })

  describe('Data Types and Encoding', () => {
    it('should convert between hex and bytes', () => {
      const hex = bytesToHex(new Uint8Array([1, 164]))
      expect(hex).toBe('0x01a4')

      const bytes = hexToBytes('0x01a4')
      expect(bytes).toEqual(new Uint8Array([1, 164]))

      const num = hexToNumber('0x01a4')
      expect(num).toBe(420)

      const hex2 = numberToHex(420)
      expect(hex2).toBe('0x01a4')

      const str = hexToString('0x48656c6c6f')
      expect(str).toBe('Hello')

      const hex3 = stringToHex('Hello')
      expect(hex3).toBe('0x48656c6c6f')
    })

    it('should perform type checking', () => {
      expect(isHex('0x123')).toBe(true)
      expect(isBytes(new Uint8Array())).toBe(true)
      expect(isAddress('0x1234567890123456789012345678901234567890')).toBe(true)
    })
  })

  describe('Unit Conversion', () => {
    it('should convert between ether units', () => {
      expect(formatEther(1000000000000000000n)).toBe('1.0')
      expect(parseEther('1.0')).toBe(1000000000000000000n)

      expect(formatGwei(1000000000n)).toBe('1.0')
      expect(parseGwei('1.0')).toBe(1000000000n)
    })
  })

  describe('Cryptographic Functions', () => {
    it('should perform crypto operations', () => {
      const hash = keccak256('0x1234')
      expect(hash).toBeDefined()

      const random = randomBytes(32)
      expect(random.length).toBe(32)
    })
  })

  describe('RLP Encoding/Decoding', () => {
    it('should encode and decode RLP', () => {
      const rlp = toRlp(['0x123', '0x456'])
      expect(rlp).toBeDefined()

      const decoded = fromRlp(rlp)
      expect(decoded).toBeDefined()
    })
  })

  describe('Memory Database', () => {
    it('should create memory databases', () => {
      const db = createMemoryDb()
      expect(db).toBeDefined()

      const initialData = new Map()
      const db2 = createMemoryDb(initialData)
      expect(db2).toBeDefined()
    })
  })
})