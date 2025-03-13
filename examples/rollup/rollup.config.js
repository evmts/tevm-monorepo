import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { tevmPlugin } from '@tevm/rollup-plugin'
import css from 'rollup-plugin-css-only'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

const production = !process.env.ROLLUP_WATCH

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
	},
	plugins: [
		// Enable importing .sol files directly
		tevmPlugin(),

		// Parse node_modules
		nodeResolve({
			browser: true,
			dedupe: ['viem'],
		}),

		// Convert CommonJS modules to ES6
		commonjs(),

		// Extract CSS into a separate file
		css({ output: 'bundle.css' }),

		// If in development mode, serve the app
		!production &&
			serve({
				open: false,
				contentBase: 'public',
				port: 8080,
			}),

		// Enable live reloading in development mode
		!production && livereload('public'),

		// If in production mode, minify
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
}
