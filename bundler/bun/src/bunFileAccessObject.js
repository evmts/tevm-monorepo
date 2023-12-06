import { file } from './bunFile.js'
import { existsSync, readFileSync } from 'fs'

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
}
