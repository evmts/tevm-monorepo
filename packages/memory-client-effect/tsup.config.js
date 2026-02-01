import { createTsUpOptions } from '@tevm/tsupconfig'

/** @type {import('tsup').Options} */
export default createTsUpOptions({
	entry: ['src/index.js'],
})
