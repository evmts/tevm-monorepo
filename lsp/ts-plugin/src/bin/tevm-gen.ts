import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { type FileAccessObject, bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import { glob } from 'glob'
// @ts-expect-error
import * as solc from 'solc'

const fao: FileAccessObject = {
	existsSync: existsSync,
	readFile: readFile,
	readFileSync: readFileSync,
	writeFileSync: writeFileSync,
	statSync,
	stat,
	mkdirSync,
	mkdir,
	writeFile,
	exists: async (path: string) => {
		try {
			await access(path)
			return true
		} catch (e) {
			return false
		}
	},
}

const showHelp = () => {
	console.log(`
Usage: node script.js [cwd] [include]
Options:
  -h, --help    Show this help message and exit
`)
}

const generate = (cwd = process.cwd(), include = ['src/**/*.sol']) => {
	console.log('Generating types from contracts...', { dir: cwd, include })
	const files = glob.sync(include, {
		cwd,
	})
	if (files.length === 0) {
		throw new Error('No files found')
	}
	files.forEach(async (file) => {
		const fileName = file.split('/').at(-1) as string
		const fileDir = file.split('/').slice(0, -1).join('/')
		const config = runSync(loadConfig(cwd))
		const solcCache = createCache(config.cacheDir, fao, cwd)
		const plugin = bundler(config, console, fao, solc, solcCache)
		plugin
			.resolveTsModule(`./${file}`, cwd, false, true)
			.then((tsContent) => writeFile(path.join(fileDir, `${fileName}.ts`), tsContent.code))
	})
}

const args = process.argv.slice(2)

if (args.includes('-h') || args.includes('--help')) {
	showHelp()
	process.exit(0)
}

const [userCwd, userInclude] = args
const cwd = userCwd || process.cwd()
const include = userInclude ? userInclude.split(',') : ['src/**/*.sol']

generate(cwd, include)
