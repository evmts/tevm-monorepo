import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

const dirs = [
	'.',
	'actions-types',
	'contract',
	'memory-client',
	'errors',
	'precompiles',
	'predeploys',
	'procedures-types',
	'http-client',
	'server',
	'base-client',
	'decorators',
	'state',
	'utils',
]

export default defineConfig(
	dirs.map((dir) =>
		createTsUpOptions({
			entry: [dir === '.' ? 'index.ts' : `${dir}/index.ts`],
			outDir: dir,
		}),
	),
)
