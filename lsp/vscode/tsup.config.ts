import { defineConfig } from 'tsup'
import packageJson from './package.json'

export default defineConfig({
	name: packageJson.name,
	entry: ['src/extension.ts'],
	outDir: 'dist',
	format: ['esm', 'cjs'],
	splitting: false,
	sourcemap: true,
	clean: true,
	bundle: true,
	metafile: process.argv.includes('--metafile'),
	external: ['vscode'],
	platform: 'node',
	tsconfig: 'tsconfig.json',
	define: { 'process.env.NODE_ENV': '"production"' },
	minify: process.argv.includes('--minify'),
})
