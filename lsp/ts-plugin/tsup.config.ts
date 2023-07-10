import packageJson from './package.json'
import { defineConfig } from 'tsup'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/index.ts', 'src/bin/evmts-gen.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	external: ['esbuild'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
