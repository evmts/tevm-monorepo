import { FileAccessObject, bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import {
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from 'fs'
import { access, mkdir, readFile, stat, writeFile } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'
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

const generate = (cwd = process.cwd(), include = ['src/**/*.sol']) => {
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
			.resolveTsModule(file, cwd, false, false)
			.then((dts) =>
				writeFile(path.join(fileDir, `${fileName}.d.ts`), dts.code),
			)
	})
}
generate()
