import { createTsUpOptions } from '@tevm/tsupconfig'
export default createTsUpOptions({
	clean: true,
	entry: ['./src/index.ts'],
})
