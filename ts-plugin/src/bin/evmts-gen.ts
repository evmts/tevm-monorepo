import { bundler } from '@evmts/bundler'
import { loadConfig } from '@evmts/config'
import { writeFile } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'

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
		const config = loadConfig(cwd)
		const plugin = bundler(config, console)
		plugin
			.resolveTsModule(file, cwd, false)
			.then((dts) =>
				writeFile(path.join(fileDir, `${fileName}.d.ts`), dts.code),
			)
	})
}
generate()
