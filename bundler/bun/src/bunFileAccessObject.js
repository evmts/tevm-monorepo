import { file } from './bunFile.js'
import { existsSync, mkdirSync, readFileSync, statSync } from 'fs'
import { mkdir, stat, writeFile } from 'fs/promises'

/**
 * A adapter around the bun file api to make it compatible with @tevm/base FileAccessObject type
 * @type {import("@tevm/base").FileAccessObject & { exists: (filePath: string) => Promise<boolean> }}
 */
export const bunFileAccesObject = {
	existsSync,
	exists: (filePath) => {
		const bunFile = file(filePath)
		return bunFile.exists()
	},
	readFile: (filePath) => {
		const bunFile = file(filePath)
		return bunFile.text()
	},
	readFileSync,
	writeFileSync: (filePath, data) => {
		const bunFile = file(filePath)
		return bunFile.writer().write(data)
	},
	statSync,
	stat,
	mkdirSync,
	mkdir,
	writeFile,
}
