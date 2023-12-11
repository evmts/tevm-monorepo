import packageJson from './package.json'
import { defineConfig } from 'tsup'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	treeshake: true,
	sourcemap: true,
	clean: true,
})
