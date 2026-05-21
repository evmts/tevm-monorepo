import { createTsUpOptions } from '@tevm/tsupconfig'
export default createTsUpOptions({
	entry: ['./src/index.ts', './src/actions/index.ts'],
})
