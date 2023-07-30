import { esbuildPluginEvmts } from '@evmts/esbuild-plugin'
import { build, context } from 'esbuild'
import { start as startLiveServer } from 'live-server'

const isDev = process.env.NODE_ENV === '"development"'

if (isDev) {
	context({
		entryPoints: ['src/index.ts'],
		outdir: 'dist',
		minify: false,
		sourcemap: true,
		bundle: true,
		define: {
			'process.env.NODE_ENV': JSON.stringify(
				process.env.NODE_ENV ?? 'production',
			),
		},
		plugins: [esbuildPluginEvmts()],
		// logLevel: "silent",
	})
		.then((ctx) => {
			return ctx.watch()
		})
		.catch((e: any) => {
			console.error(e)
			process.exit(1)
		})

	startLiveServer({
		root: 'build',
		open: false,
		host: 'localhost',
		port: 3000,
		// logLevel: 0,
	})
} else {
	build({
		entryPoints: ['src/index.ts'],
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
	}).catch((e: any) => {
		console.error(e)
		process.exit(1)
	})
}
