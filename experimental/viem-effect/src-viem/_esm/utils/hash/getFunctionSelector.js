import { slice } from '../data/slice.js'
import { hashAbiItem, hashFunction } from './hashFunction.js'
export const getFunctionSelector = (fn) => {
	if (typeof fn === 'string') return slice(hashFunction(fn), 0, 4)
	return slice(hashAbiItem(fn), 0, 4)
}
//# sourceMappingURL=getFunctionSelector.js.map
