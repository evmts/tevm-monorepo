import packageJson from './package.json'
import { defineConfig } from 'tsup'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/index.js'],
	outDir: 'dist',
	format: ['cjs', 'esm'],
	splitting: false,
	sourcemap: true,
	clean: true,
})
