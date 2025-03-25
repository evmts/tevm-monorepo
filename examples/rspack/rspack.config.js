import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HtmlPlugin } from '@rspack/plugin-html'
import { tevmPlugin } from '@tevm/rspack-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		publicPath: '/',
		clean: true,
	},
	plugins: [
		new HtmlPlugin({
			template: './public/index.html',
		}),
		tevmPlugin(),
	],
	resolve: {
		extensions: ['.js', '.json', '.sol'],
	},
	devServer: {
		port: 8090,
		hot: true,
		liveReload: true,
		open: true,
		historyApiFallback: true,
	},
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
	},
}
