import { createTsUpOptions } from '@tevm/tsupconfig'

export default createTsUpOptions({
	target: 'js',
	entry: ['src/index.ts'],
})
