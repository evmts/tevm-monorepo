import { hashAbiItem, hashFunction } from './hashFunction.js'
export const getEventSelector = (event) => {
	if (typeof event === 'string') return hashFunction(event)
	return hashAbiItem(event)
}
//# sourceMappingURL=getEventSelector.js.map
