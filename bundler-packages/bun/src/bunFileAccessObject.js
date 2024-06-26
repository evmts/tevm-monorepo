import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { file } from './bunFile.js'

/**
 * A adapter around the bun file api to make it compatible with @tevm/base-bundler FileAccessObject type
 * @type {import("@tevm/base-bundler").FileAccessObject}
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
