import { keccak256 } from '@tevm/utils'

/**
 * @deprecated
 * Returns the applied key for a given address
 * Used for saving preimages
 * @type {import("../state-types/index.js").StateAction<'getAppliedKey'>}
 */
export const getAppliedKey = () => (address) => {
	return keccak256(address, 'bytes')
}
