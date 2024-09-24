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
  'http-client',
  'server',
  'node',
  'decorators',
  'state',
  'sync-storage-persister',
  'utils',
  'block',
  'blockchain',
  'evm',
  'receipt-manager',
  'tx',
  'txpool',
  'address',
  'vm',
  'bundler/',
  'bundler/base-bundler',
  'bundler/bun-plugin',
  'bundler/compiler',
  'bundler/config',
  'bundler/esbuild-plugin',
  'bundler/rollup-plugin',
  'bundler/rspack-plugin',
  'bundler/solc',
  'bundler/vite-plugin',
  'bundler/webpack-plugin',
]

export default defineConfig(
  dirs.map((dir) =>
    createTsUpOptions({
      entry: [dir === '.' ? 'index.ts' : `${dir}/index.ts`],
      outDir: dir,
    }),
  ),
)
