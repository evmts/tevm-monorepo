import { targets } from './targets.js'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Creates tsup options from params
 * @param {object} options
 * @param {Array<string>} [options.entry] - entry points Defaults to src/index.js
 * @param {import('./targets.js').Target} [options.target] - environment to target Defaults to js
 * @param {Array<'cjs' | 'esm'>} [options.format] - module format Defaults to cjs and esm
 * @returns {import('tsup').Options}
 */
export const createTsUpOptions = ({
	entry = ['src/index.js'],
	target = 'js',
	format = ['cjs', 'esm'],
}) => {
	const { name } = JSON.parse(
		readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
	)

	return {
		name,
		entry,
		outDir: 'dist',
		target: targets[target],
		format,
		splitting: false,
		sourcemap: true,
		clean: false,
		skipNodeModulesBundle: true,
	}
}
