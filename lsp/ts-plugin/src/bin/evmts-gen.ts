import { foundryModules } from '@evmts/solidity-resolver'
import { writeFile } from 'fs/promises'
import { glob } from 'glob'
import path from 'path'

const cwd = process.cwd()

const files = glob.sync('src/**/*.sol', {
	cwd,
})

if (files.length === 0) {
	throw new Error('No files found')
}

files.forEach((file) => {
	const fileName = file.split('/').at(-1) as string
	const fileDir = file.split('/').slice(0, -1).join('/')

	const plugin = foundryModules(
		{
			out: 'artifacts',
			project: '.',
		},
		console,
	)

	plugin
		.resolveDts(file, cwd)
		.then((dts) => writeFile(path.join(fileDir, `${fileName}.d.ts`), dts))
})
