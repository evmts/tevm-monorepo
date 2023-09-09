import { file } from './bunFile'
import type { FileAccessObject } from '@evmts/bundler'
import { existsSync, readFileSync } from 'fs'

export const bunFileAccesObject: FileAccessObject & {
	exists: (filePath: string) => Promise<boolean>
} = {
	existsSync,
	exists: (filePath: string) => {
		const bunFile = file(filePath)
		return bunFile.exists()
	},
	readFile: (filePath: string) => {
		const bunFile = file(filePath)
		return bunFile.text()
	},
	readFileSync,
}
