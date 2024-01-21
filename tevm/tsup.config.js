import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

const dirs = [
	'.',
	'actions-types',
	'client-types',
	'contract',
	'memory-client',
	'predeploys',
	'procedures-types',
	'remote-client',
	'server',
]

export default defineConfig(
	dirs.map((dir) =>
		createTsUpOptions({
			entry: [dir === '.' ? 'index.ts' : `${dir}/index.ts`],
			outDir: dir,
		}),
	),
)
