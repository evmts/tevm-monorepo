import { esbuildPluginEvmts } from '@evmts/esbuild-plugin'
import { build } from 'esbuild'

build({
	entryPoints: ['src/index.js'],
	outdir: 'dist',
	minify: true,
	sourcemap: false,
	bundle: true,
	define: {
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV ?? 'production',
		),
	},
	plugins: [esbuildPluginEvmts()],
	// logLevel: "silent",
}).catch((e) => {
	console.error(e)
	process.exit(1)
})
