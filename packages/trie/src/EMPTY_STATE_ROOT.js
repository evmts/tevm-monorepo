/**
 * An hardcoded state root that represents an empty trie.
 * Can be dynamically computed using keccak256([]) or generateStateRoot([])
 */
export const EMPTY_STATE_ROOT = Uint8Array.from([
	86, 232, 31, 23, 27, 204, 85, 166, 255, 131, 69, 230, 146, 192, 248, 110, 91, 72, 224, 27, 153, 108, 173, 192, 1, 98,
	47, 181, 227, 99, 180, 33,
])
