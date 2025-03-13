import { createTsUpOptions } from '@tevm/tsupconfig'

export default createTsUpOptions({
	entry: ['src/index.ts'],
	noExternal: ['@tevm/contract'],
	exclude: ['**/*.spec.ts', '**/*.test.ts', 'test/**/*'],
})
