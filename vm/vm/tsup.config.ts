import packageJson from './package.json'
import { defineConfig } from 'tsup'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/index.ts', 'src/viem/index.js'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	treeshake: true,
	sourcemap: true,
	clean: true,
})
