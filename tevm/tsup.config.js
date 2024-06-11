import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

const dirs = [
'.',
'actions',
'contract',
'memory-client',
'errors',
'common',
'precompiles',
'predeploys',
'procedures',
'http-client',
'server',
'base-client',
'decorators',
'state',
'sync-storage-persister',
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
