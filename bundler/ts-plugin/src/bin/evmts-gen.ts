import { FileAccessObject, bundler, createCache } from '@evmts/base'
import { loadConfig } from '@evmts/config'
import { runSync } from 'effect/Effect'
import { existsSync, readFileSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'

const fao: FileAccessObject = {
	existsSync: existsSync,
	readFile: readFile,
	readFileSync: readFileSync,
}

const generate = (cwd = process.cwd(), include = ['src/**/*.sol']) => {
	const files = glob.sync(include, {
		cwd,
	})
	if (files.length === 0) {
		throw new Error('No files found')
	}
	const solcCache = createCache(console)
	files.forEach(async (file) => {
		const fileName = file.split('/').at(-1) as string
		const fileDir = file.split('/').slice(0, -1).join('/')
		const config = runSync(loadConfig(cwd))
		const plugin = bundler(config, console, fao, solcCache)
		plugin
			.resolveTsModule(file, cwd, false, false)
			.then((dts) =>
				writeFile(path.join(fileDir, `${fileName}.d.ts`), dts.code),
			)
	})
}
generate()
