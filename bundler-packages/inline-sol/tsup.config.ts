import { createTsUpOptions } from '@tevm/tsupconfig'
export default createTsUpOptions({
	target: 'node',
	entry: ['src/index.ts'],
})
