// This is adapted from @ethereumjs/vm package not the @ethereumjs/util package
import { DefensiveNullCheckError, InvalidBytesSizeError } from '@tevm/errors'
import { hexToBytes, keccak256 } from './viem.js'

const zeros = (bytes: number): Uint8Array => {
	return new Uint8Array(bytes)
}

const BYTE_SIZE = 256

/**
 * A simple Bloom filter implementation originally from ethereumjs
 */
export class Bloom {
	bitvector: Uint8Array

	/**
	 * Represents a Bloom filter.
	 * @throws {InvalidBytesSizeError} If the byte size of the bitvector is not 256.
	 */
	constructor(bitvector?: Uint8Array) {
		if (!bitvector) {
			this.bitvector = zeros(BYTE_SIZE)
		} else {
			if (bitvector.length !== BYTE_SIZE) throw new InvalidBytesSizeError(BYTE_SIZE, bitvector.length)
			this.bitvector = bitvector
		}
	}

	/**
	 * Adds an element to a bit vector of a 64 byte bloom filter.
	 * @param e - The element to add
	 * @throws {never}
	 */
	add(e: Uint8Array) {
		const eBytes = hexToBytes(keccak256(e))
		const mask = 2047 // binary 11111111111

		for (let i = 0; i < 3; i++) {
			const first2bytes = new DataView(eBytes.buffer).getUint16(i * 2)
			const loc = mask & first2bytes
			const byteLoc = loc >> 3
			const bitLoc = 1 << (loc % 8)
			let item = this.bitvector[BYTE_SIZE - byteLoc - 1]
			if (item === undefined) {
				throw new DefensiveNullCheckError('item is not defined. There is a bug in the implementation')
			}
			item |= bitLoc
			this.bitvector[BYTE_SIZE - byteLoc - 1] = item
		}
	}

	/**
	 * Checks if an element is in the bloom.
	 * @param e - The element to check
	 * @throws {never}
	 */
	check(e: Uint8Array): boolean {
		const eBytes = hexToBytes(keccak256(e))
		const mask = 2047 // binary 11111111111
		let match = true

		for (let i = 0; i < 3 && match; i++) {
			const first2bytes = new DataView(eBytes.buffer).getUint16(i * 2)
			const loc = mask & first2bytes
			const byteLoc = loc >> 3
			const bitLoc = 1 << (loc % 8)
			const item = this.bitvector[BYTE_SIZE - byteLoc - 1]
			if (item === undefined) {
				throw new DefensiveNullCheckError('item is not defined. There is a bug in the implementation')
			}
			match = (item & bitLoc) !== 0
		}

		return Boolean(match)
	}

	/**
	 * Checks if multiple topics are in a bloom.
	 * @returns `true` if every topic is in the bloom
	 * @throws {never}
	 */
	multiCheck(topics: Uint8Array[]): boolean {
		return topics.every((t: Uint8Array) => this.check(t))
	}

	/**
	 * Bitwise or blooms together.
	 * @throws {never}
	 */
	or(bloom: Bloom) {
		for (let i = 0; i < BYTE_SIZE; i++) {
			const a = this.bitvector[i]
			const b = bloom.bitvector[i]
			if (a === undefined) {
				throw new DefensiveNullCheckError('a is not defined. Please open an issue in the tevm github repo')
			}
			if (b === undefined) {
				throw new DefensiveNullCheckError('b is not defined. Please open an issue in the tevm github repo')
			}
			this.bitvector[i] = a | b
		}
	}
}
