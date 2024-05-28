import { createTsUpOptions } from '@tevm/tsupconfig'

export default createTsUpOptions({
	entry: ['src/index.ts', 'src/bin/tevm-gen.ts'],
	target: 'node',
})
