/**
 * A hardcoded state root that represents an empty trie.
 * Can be dynamically computed using keccak256([]) or genesisStateRoot({})
 */
const EMPTY_STATE_ROOT_BYTES = Uint8Array.from([
	86, 232, 31, 23, 27, 204, 85, 166, 255, 131, 69, 230, 146, 192, 248, 110, 91, 72, 224, 27, 153, 108, 173, 192, 1, 98,
	47, 181, 227, 99, 180, 33,
])

const throwImmutable = () => {
	throw new TypeError('EMPTY_STATE_ROOT is immutable')
}

const immutableStateRoot = Uint8Array.from(EMPTY_STATE_ROOT_BYTES)
Object.defineProperties(immutableStateRoot, {
	buffer: {
		get() {
			return immutableStateRoot.slice().buffer
		},
	},
	copyWithin: {
		value() {
			return throwImmutable()
		},
	},
	fill: {
		value() {
			return throwImmutable()
		},
	},
	reverse: {
		value() {
			return throwImmutable()
		},
	},
	set: {
		value() {
			return throwImmutable()
		},
	},
	sort: {
		value() {
			return throwImmutable()
		},
	},
	subarray: {
		value() {
			return immutableStateRoot.slice()
		},
	},
})

/**
 * @type {Uint8Array}
 */
export const EMPTY_STATE_ROOT = immutableStateRoot
