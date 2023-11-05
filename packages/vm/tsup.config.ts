import packageJson from './package.json'
import { defineConfig } from 'tsup'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/index.ts'],
	outDir: 'dist',
	format: ['esm'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
