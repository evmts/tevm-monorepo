import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/index.ts', 'src/bin/tevm-gen.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	external: ['esbuild'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
